import { python } from "@codemirror/lang-python";
import { LanguageSupport } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { StreamLanguage } from "@codemirror/stream-parser";
import React from "react";
import { create } from "react-test-renderer";

import { defaultLight } from "../../themes";

import * as mocks from "./languages-mocks";
import { useSyntaxHighlight } from "./useSyntaxHighlight";
import {
  getCodeMirrorLanguage,
  getSyntaxHighlight,
  getLanguageFromFile,
} from "./utils";

const highlightTheme = getSyntaxHighlight(defaultLight);
const additionalLanguages = [
  {
    name: "shell",
    extensions: ["sh"],
    language: new LanguageSupport(StreamLanguage.define(shell)),
  },
  {
    name: "python",
    extensions: ["py"],
    language: python(),
  },
];

describe(useSyntaxHighlight, () => {
  Object.entries(mocks).forEach(([fileType, code]) => {
    it(`renders a ${fileType} block`, () => {
      const languageExtension = getLanguageFromFile(
        "",
        fileType,
        additionalLanguages
      );
      const langSupport = getCodeMirrorLanguage(
        languageExtension,
        additionalLanguages
      );

      const reactElements = useSyntaxHighlight({
        code,
        highlightTheme,
        langSupport,
      });

      expect(create(<>{reactElements}</>).toJSON()).toMatchSnapshot();
    });
  });
});
