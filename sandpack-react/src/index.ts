/**
 * React components that give you the power of editable sandboxes that run in the browser. Powered by Sandpack, the online bundler used by CodeSandbox.
 *
 * ```jsx
 * import { Sandpack } from "@codesandbox/sandpack-react";
 *
 * <Sandpack template="react" />;
 * ```
 * @module
 */

// Components
export * from "./components/icons";
export * from "./components";
export * from "./components/common";
export * from "./hooks";

// Contexts
export * from "@code-hike/classer";
export { getCssText as getSandpackCssText } from "./styles";
export * from "./styles/themeContext";
export * from "./contexts/sandpackContext";

// Presets
export * from "./presets/";
export * from "./themes";
export * from "./types";
export * from "./templates";
