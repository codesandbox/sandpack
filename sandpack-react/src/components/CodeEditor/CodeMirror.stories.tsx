import React from 'react';

import { CodeEditor } from './index';

import { SandpackProvider } from '../../contexts/sandpackContext';
import { SandpackThemeProvider } from '../../contexts/themeContext';

export default {
  title: 'components/CodeMirror',
  component: CodeEditor,
};

export const JustEditor = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider>
      <CodeEditor
        code="const c = a+b;"
        fileType="jsx"
        onCodeUpdate={() => console.log('code update')}
      />
    </SandpackThemeProvider>
  </SandpackProvider>
);
