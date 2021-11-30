import React from "react";

import { Sandpack } from "./CustomSandpack";

const indexCode = `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`;

const appCode = `
// Just a placeholder function
function Code() {
  return (
    <div>
      <h1>Something is wrong with this announcement🤔</h1>
      <p>Please could you help us and fix the issue ☝️?</p>
    </div>
  );
};

// Details about the announcement
function Announcement() {
  return (
      <div>
        <h1>Hello Sandpack✨</h1>
        <p>Keen to know more about the announcement?</p>
        <a href="https://codesandbox.io/blog">Visit the blog post</a>
      </div>
  );
};

export default function App() {
  return(
    <div className="App">
      <Code/>
    </div>
  )  // ^ TODO change the <Code/> to <Announcement/> before the release
}`;

const AnnouncementSandpack: React.FC = (props) => {
  return (
    <div className="AnnouncementSandpack">
      <Sandpack
        customSetup={{
          dependencies: {
            "@codesandbox/sandpack-react": "latest",
          },
        }}
        files={{
          "/App.js": appCode,
          "/index.js": {
            code: indexCode,
            hidden: true,
          },
        }}
        template="react"
      />
    </div>
  );
};

export { AnnouncementSandpack };
