import { useEffect, useState } from "react";

import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  useSandpack,
} from "../..";

export default {
  title: "components/Testing",
};

const testingFile = `import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

describe("AppComponent", () => {
  beforeEach(async () => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
    await TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(\`should have as title 'Hello World'\`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("Hello World");
  });

  it("should render title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain("Hello World");
  });
});`;

const SandpackTests: React.FC = () => {
  const [state, setState] = useState({ state: "IDLE" });
  const { sandpack, listen } = useSandpack();

  useEffect(() => {
    listen((message) => {
      if (message.type === "test") {
        if (message.event === "add_test") {
          setState((prev) => ({
            ...prev,
            state: "RESULTS",
            results: [
              ...(prev.results ?? []),
              { testName: message.testName, state: "added" },
            ],
          }));

          return;
        }

        if (message.event === "total_test_start") {
          setState({ state: "LOADING" });

          return;
        }

        if (message.event === "test_start" || message.event === "test_end") {
          setState((prev) => ({
            ...prev,
            results: prev.results.map((item) =>
              item.testName === message.test.name
                ? { ...item, state: message.test.status }
                : item
            ),
          }));

          return;
        }
      }
    });
  }, []);

  const runAllTests = () => {
    setState({ state: "IDLE" });

    Object.values(sandpack.clients).forEach((client) => {
      client.dispatch({
        type: "run-all-tests",
      });
    });
  };

  return (
    <div>
      {state.state === "LOADING" && "Running tests..."}
      {state.state === "RESULTS" &&
        state.results.map(({ testName, state }) => {
          return (
            <div>
              {testName} : {state}
            </div>
          );
        })}
      <button onClick={runAllTests}>Run</button>
    </div>
  );
};

export const Main: React.FC = () => {
  return (
    <SandpackProvider
      files={{ "/src/app/app.spec.ts": testingFile }}
      template="angular"
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackLayout>

      <SandpackTests />
    </SandpackProvider>
  );
};
