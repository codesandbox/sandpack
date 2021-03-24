import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { SandpackThemeProvider } from '../contexts/themeContext';
import { useSandpack } from '../hooks/useSandpack';
import { SandpackThemeProp } from '../types';

export interface SandpackLayoutProps {
  theme?: SandpackThemeProp;
}

export const SandpackLayout: React.FC<SandpackLayoutProps> = ({
  children,
  theme,
}) => {
  const { sandpack } = useSandpack();
  const c = useClasser('sp');

  return (
    <SandpackThemeProvider theme={theme}>
      <div className={c('layout')} ref={sandpack.lazyAnchorRef}>
        {children}
      </div>
    </SandpackThemeProvider>
  );
};
