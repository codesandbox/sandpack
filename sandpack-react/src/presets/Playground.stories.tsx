import { Sandpack } from "../";

export default {
  title: "Playground",
};

const code = `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <p>Home</p>
              <Link to="page">page</Link>
            </>
          }
        />
        <Route 
          path="/page" 
          element={
            <>
              <p>page</p>
              <Link to="/">home</Link>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};`;

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      template="react"
      files={{
        "/App.js": code,
      }}
      customSetup={{ dependencies: { "react-router-dom": "latest" } }}
      options={{ showNavigator: true }}
    />
  );
};
