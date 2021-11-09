import type { HighlightedText } from "./shared-types";

interface Feature {
  title: string;
  description: string;
  iconKey: string;
}

interface FeaturesSection {
  features: Feature[];
  title: HighlightedText[];
}

export const content: FeaturesSection = {
  features: [
    {
      title: "Full editor experience",
      description:
        "Sandpack is using CodeMirror under the hood, giving you all the basic capabilities of a code editor and syntax highlight.",
      iconKey: "editor",
    },
    {
      title: "Advanced preview",
      description:
        "Sandpack embeds the browser bundler that powers codesandbox.io and takes advantage of the following features: hot module reloading API, friendly error overlay, powerful transpilation result caching, dependency resolver.",
      iconKey: "preview",
    },
    {
      title: "Export to CodeSandbox",
      description:
        "With Sandpack, you're always one click away from opening your code snippet in codesandbox",
      iconKey: "export",
    },
  ],
  title: [
    { text: "Live coding environment", highlight: false },
    { text: "in minutes.", highlight: true },
  ],
};
