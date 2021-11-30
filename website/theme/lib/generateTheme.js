import { defaultLight, defaultDark } from "@codesandbox/sandpack-react";
import Values from "values.js";

export const DEFAULT_COLORS = [];

export const generateBasedOnSimpleColors = (color, base) => {
  const primaryColors = new Values(color.primary);
  const secondaryColors = new Values(color.secondary);
  const tertiaryColors = new Values(color.tertiary);

  let theme = base === "light" ? defaultLight : defaultDark;

  let pShades = primaryColors.all(30);
  let sShades = secondaryColors.all(30);
  let tShades = tertiaryColors.all(30);

  if (base === "light") {
    pShades = pShades.reverse();
  }

  theme.palette = {
    activeText: color.primary,
    defaultText: theme.palette.defaultText,
    inactiveText: pShades[6].hexString(),
    activeBackground: theme.palette.activeBackground,
    defaultBackground: theme.palette.defaultBackground,
    inputBackground: theme.palette.inputBackground,
    accent: color.primary,
    errorBackground: color.tertiary,
    errorForeground: tShades[3].hexString(),
  };
  theme.syntax = {
    plain: theme.syntax.plain,
    comment: theme.syntax.comment,
    keyword: color.primary,
    tag: sShades[2].hexString(),
    punctuation: theme.syntax.punctuation,
    definition: pShades[1].hexString(),
    property: color.primary,
    static: color.tertiary,
    string: sShades[3].hexString(),
  };

  return { ...theme };
};
