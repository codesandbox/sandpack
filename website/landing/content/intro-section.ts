import type { HighlightedText } from "./shared-types";

interface Feature {
  title: string;
  description: string;
  snippet?: string;
}

interface IntroSection {
  features: Feature[];
  importCommand?: string;
  title: HighlightedText[];
}

export const content: IntroSection = {
  features: [
    {
      title: "Start with preset templates",
      description:
        "Use the <code>template</code> prop to choose an option made by CodeSandbox: react, angular, vanilla.",
    },
    {
      title: "Customize your setup",
      description:
        "If you want to add dependencies or you need a different file structure, you can use the <code>customSetup</code> prop.",
    },
    {
      title: "Configure your editor",
      description:
        "The <code>options</code> prop allows you to toggle on/off different features of the code editor.",
      snippet: `
    <Sandpack
      options={{
        showNavigator: true,
        showLineNumbers: true
      }}
    />
      `,
    },
    {
      title: "Customize your setup",
      description:
        "Use the <code>theme</code> prop to set a predefined option made by CodeSandbox. Try below, just click to change code and see all the predefined options. (mention the user can create its own theme).",
    },
    {
      title: "Build your own Sandpack",
      description:
        "The library exports a set of composable components and hooks that allow you to tailor the editing experience to your own needs.",
      snippet: `
    <SandpackProvider>
      <Sandpacklayout>
      <SandpackEditor />
      <SandpackPreview />
      <Sandpacklayout>
    </SandpackProvider>
      `,
    },
  ],
  importCommand: `import { Sandpack } from "@codesandbox/sandpack-react";`,
  title: [
    { text: "Live coding", highlight: true },
    { text: "in the browser.", highlight: false },
  ],
};
