import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
} from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      {new Array(30).fill(" ").map(() => {
        return (
          <SandpackProvider initMode="user-visible">
            <SandpackLayout>
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
        );
        return <Sandpack options={{ initMode: "lazy" }} />;
      })}
    </>
  );
};
