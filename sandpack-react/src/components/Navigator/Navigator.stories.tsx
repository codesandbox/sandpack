import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../styles/themeContext";
import { SandpackPreview } from "../Preview";
import { SandpackLayout } from "../common/Layout";

import { Navigator } from ".";

export default {
  title: "components/Navigator",
};

export const Component: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <Navigator />
    </SandpackThemeProvider>
  </SandpackProvider>
);

const routingSetup = {
  dependencies: {
    "react-router-dom": "5.3.0",
    "react-scripts": "latest",
    react: "latest",
    "react-dom": "latest",
  },
  files: {
    "/index.html": {
      code: `<div id="root"></div>`,
    },
    "/index.js": {
      code: `import ReactDOM from "react-dom";
import App from "./example";

ReactDOM.render(<App />, document.getElementById("root"));
        `,
    },
    "/example.js": {
      code: `import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function BasicExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
        
`,
    },
  },
};

export const WithRouting: React.FC = () => (
  <SandpackProvider customSetup={routingSetup} template="react">
    <SandpackLayout>
      <SandpackPreview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithStartingRoute: React.FC = () => (
  <SandpackProvider
    customSetup={routingSetup}
    options={{
      startRoute: "/about",
    }}
    template="react"
  >
    <SandpackLayout>
      <SandpackPreview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);
