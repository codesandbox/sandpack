/**
 * @jest-environment jsdom
 */
import { python } from "@codemirror/lang-python";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

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

      const { container } = render(<>{reactElements}</>);
      expect(container).toMatchSnapshot();
    });
  });
});
