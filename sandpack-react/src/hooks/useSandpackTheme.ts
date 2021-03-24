import * as React from 'react';
import { SandpackThemeContext } from '../contexts/themeContext';

export const useSandpackTheme = () => {
  const { theme, id } = React.useContext(SandpackThemeContext);
  return { theme, themeId: id };
};
