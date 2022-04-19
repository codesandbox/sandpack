import { Sandpack } from "../";

export default {
  title: "Intro/Playground",
};

const files = {
  "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`,
  "/main.tsx": `import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

const CountingComponent = () => {
	const [count, setCount] = createSignal(0);
	const interval = setInterval(
		() => setCount(c => c + 1),
		1000
	);
	onCleanup(() => clearInterval(interval));
	return <div>Count value is {count()}</div>;
};

render(() => <CountingComponent />, document.getElementById("app"));`,
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      files={files}
      customSetup={{
        environment: "solid",
        dependencies: {
          "solid-js": "latest",
        },
      }}
      options={{
        bundlerURL: "https://xmw0u9-1234.preview.csb.app/",
      }}
    />
  );
};
