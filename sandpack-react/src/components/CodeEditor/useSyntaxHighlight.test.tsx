import React from "react";
import { create } from "react-test-renderer";

import { defaultLight } from "../../themes";

import * as mocks from "./languages-mocks";
import { useSyntaxHighlight } from "./useSyntaxHighlight";
import { getCodeMirrorLanguage, getSyntaxHighlight } from "./utils";

const highlightTheme = getSyntaxHighlight(defaultLight);

describe(useSyntaxHighlight, () => {
  Object.entries(mocks).forEach(([fileType, code]) => {
    it(`renders a ${fileType} block`, () => {
      const reactElements = useSyntaxHighlight({
        code,
        highlightTheme,
        langSupport: getCodeMirrorLanguage(undefined, fileType),
      });

      expect(create(<>{reactElements}</>).toJSON()).toMatchSnapshot();
    });
  });
});
