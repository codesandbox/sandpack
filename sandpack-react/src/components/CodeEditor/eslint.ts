/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { EditorView } from "@codemirror/view";
import type { Diagnostic } from "@codemirror/lint";
import type { Text } from "@codemirror/text";
import { Linter } from "eslint/lib/linter/linter";
import React from "react";

const getCodeMirrorPosition = (
  doc: Text,
  { line, column }: { line: number; column?: number }
): number => {
  return doc.line(line).from + (column ?? 0) - 1;
};

const linter = new Linter();

// HACK! Eslint requires 'esquery' using `require`, but there's no commonjs interop.
// because of this it tries to run `esquery.parse()`, while there's only `esquery.default.parse()`.
// This hack places the functions in the right place.
const esquery = require("esquery");
esquery.parse = esquery.default?.parse;
esquery.matches = esquery.default?.matches;

const reactRules = require("eslint-plugin-react-hooks").rules;
linter.defineRules({
  "react-hooks/rules-of-hooks": reactRules["rules-of-hooks"],
  "react-hooks/exhaustive-deps": reactRules["exhaustive-deps"],
});

const options = {
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};

const runESLint = (
  doc: Text
): { errors: any[]; codeMirrorErrors: Diagnostic[] } => {
  const codeString = doc.toString();
  const errors = linter.verify(codeString, options) as any[];

  const severity = {
    1: "warning",
    2: "error",
  };

  const codeMirrorErrors = errors
    .map((error) => {
      if (!error) return undefined;

      const from = getCodeMirrorPosition(doc, {
        line: error.line,
        column: error.column,
      });

      const to = getCodeMirrorPosition(doc, {
        line: error.endLine ?? error.line,
        column: error.endColumn ?? error.column,
      });

      return {
        ruleId: error.ruleId,
        from,
        to,
        severity: severity[error.severity],
        message: error.message,
      };
    })
    .filter(Boolean) as Diagnostic[];

  return {
    codeMirrorErrors,
    errors: errors.map((item) => {
      return {
        ...item,
        severity: severity[item.severity],
      };
    }),
  };
};

type LintDiagnostic = Array<{
  line: number;
  column: number;
  severity: "warning" | "error";
  message: string;
}>;

export const useSandpackLint = (): any => {
  const [lintErrors, setLintErrors] = React.useState<LintDiagnostic>([]);
  const [lintExtensions, setLintExtensions] = React.useState<any>([]);

  React.useEffect(() => {
    const loadLinter = async (): Promise<any> => {
      const { linter } = await import("@codemirror/lint");
      const onLint = linter(async (props: EditorView) => {
        const editorState = props.state.doc;
        const { errors, codeMirrorErrors } = runESLint(editorState);
        // Ignore parsing or internal linter errors.
        const isReactRuleError = (error: any): any => error.ruleId != null;
        setLintErrors(errors.filter(isReactRuleError));
        return codeMirrorErrors.filter(isReactRuleError);
      });
      setLintExtensions([onLint]);
    };

    loadLinter();
  }, []);

  return { lintErrors, lintExtensions };
};
