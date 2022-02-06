import { Sandpack } from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      files={{
        "Foo.js": "",
      }}
      options={{
        showTabs: true,
        openPaths: ["/src/app/app.component.css", "Foo.js"],
        activePath: "/src/index.html",
      }}
      template="angular"
    />
  );
};
