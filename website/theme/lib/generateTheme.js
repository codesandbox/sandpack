import { defaultLight, defaultDark } from "@codesandbox/sandpack-react";
import Values from "values.js";

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

  theme.colors = {
    surface1: theme.colors.surface1,
    surface2: theme.colors.surface2,
    surface3: theme.colors.surface3,

    clickable: theme.colors.clickable,
    base: theme.colors.base,
    disabled: theme.colors.disabled,
    hover: theme.colors.hover,

    accent: color.primary,

    error: tShades[3].hexString(),
    errorSurface: tShades[0].hexString(),
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
