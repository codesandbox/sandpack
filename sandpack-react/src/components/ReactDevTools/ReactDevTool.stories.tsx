import { SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout, SandpackThemeProvider } from "../..";

import { SandpackReactDevTools } from "./";

export default {
  title: "components/ReactDevTools",
};

const ReactDevTool = (): JSX.Element => (
  <SandpackProvider
    customSetup={{
      files: {
        "/App.js": `
const Container = ({children}) => <div>{children}</div>          
const Button = () => <p>Button</p>

export default function App() {
  return (
    <Container>
      <div>
        <Button />
        <Button />
        <h1>Hello World</h1>
        <Button />
      </div>
    </Container>
  )
}
      `,
      },
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <SandpackLayout>
        <SandpackPreview />
        <SandpackReactDevTools style={{ width: "50%" }} />
      </SandpackLayout>
    </SandpackThemeProvider>
  </SandpackProvider>
);

export { ReactDevTool };

export const MultipleReactDevTool = (): JSX.Element => {
  return (
    <>
      <ReactDevTool />
      <ReactDevTool />
      <ReactDevTool />
    </>
  );
};
