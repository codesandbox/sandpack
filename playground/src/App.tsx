import { Route, Routes } from "react-router";

import { Dashboard } from "./Dashboard";
import { Editor } from "./Editor";

function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="/" />
      <Route element={<Editor />} path="/:sandboxId" />
    </Routes>
  );
}

export default App;
