import React from "react";
import { Sandpack } from "../";
import { renderToString } from "react-dom/server";

describe("Sandpack", () => {
  it("renders on a server without crashing", () => {
    const Foo = () => <img src="bar.png" />;
    const renderOnServer = () =>
      renderToString(
        <main>
          <Foo />
        </main>
      );
    expect(renderOnServer).not.toThrow();
  });
});
