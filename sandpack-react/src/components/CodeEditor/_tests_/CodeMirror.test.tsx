import React from "react";
import { create, act } from "react-test-renderer";

import { SandpackProvider, SandpackThemeProvider } from "../../..";
import { CodeMirror } from "../CodeMirror";

beforeEach(() => {
  jest.useFakeTimers();
});

const Provider: React.FC = ({ children }) => {
  return (
    <SandpackProvider>
      <SandpackThemeProvider>{children}</SandpackThemeProvider>
    </SandpackProvider>
  );
};

describe("CodeMirror", () => {
  test("SyntaxHighlight: HTML", () => {
    let component;

    act(() => {
      component = create(
        <Provider>
          <CodeMirror />
        </Provider>
      );
    });

    act(() => {
      component.update(
        <Provider>
          <CodeMirror />
        </Provider>
      );
    });

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
