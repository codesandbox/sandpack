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

const testingFile = `import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
  it(\`should have as title 'Hello World'\`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Hello World');
  }));
  
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to angular-unit-test!');
  }));
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

        if (message.type === "total_test_start") {
          setState({ state: "LOADING" });

          return;
        }

        if (message.type === "test_start") {
          setState((prev) => ({
            ...prev,
            results: prev.results.map((item) =>
              console.log(item.testName, message.test.name) ||
              item.testName === message.test.name
                ? { ...item, status: message.test.status }
                : item
            ),
          }));

          return;
        }

        console.log(message);
      }
    });
  }, []);

  const runAllTests = () => {
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
