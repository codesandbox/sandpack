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

describe(useSyntaxHighlight, () => {
  Object.entries(mocks).forEach(([fileType, code]) => {
    it(`renders a ${fileType} block`, () => {
      const languageExtension = getLanguageFromFile("", fileType);
      const langSupport = getCodeMirrorLanguage(languageExtension);

      const reactElements = useSyntaxHighlight({
        code,
        highlightTheme,
        langSupport,
      });

      expect(create(<>{reactElements}</>).toJSON()).toMatchSnapshot();
    });
  });
});
