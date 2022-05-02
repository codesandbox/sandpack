import React from "react";
import { SandpackProvider } from "./sandpackContext";

import { create } from "react-test-renderer";
describe(SandpackProvider, () => {
  it("updates a file", () => {
    const root = create(<SandpackProvider template="react" />);
    const instance = root.getInstance();

    expect(instance.state.files["/App.js"]).toEqual({
      code: `export default function App() {
  return <h1>Hello World</h1>
}
`,
    });

    instance.updateFile("/App.js", "Foo");

    expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
  });

  it("updates multiples files", () => {
    const root = create(<SandpackProvider template="react" />);
    const instance = root.getInstance();

    instance.updateFile({ "/App.js": "Foo", "/index.js": "Baz" });

    expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
    expect(instance.state.files["/index.js"]).toEqual({ code: `Baz` });
  });

  it("updates multiples files in a row", () => {
    const root = create(<SandpackProvider template="react" />);
    const instance = root.getInstance();

    instance.updateFile("/App.js", "Foo");
    instance.updateFile("/index.js", "Baz");

    expect(instance.state.files["/App.js"]).toEqual({ code: `Foo` });
    expect(instance.state.files["/index.js"]).toEqual({ code: `Baz` });
  });
});
