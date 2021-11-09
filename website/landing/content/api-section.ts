import type { HighlightedText } from "./shared-types";

interface Feature {
  title: string;
  description: string;
  imageUrl?: string;
}

interface ApiSection {
  title: HighlightedText[];
  features: Feature[];
}

export const content: ApiSection = {
  title: [
    {
      text: "Building blocks of the Sandpack ecosystem.",
      highlight: false,
    },
  ],
  features: [
    {
      title: "Providers",
      description:
        "We export a <code>SandpackProvider</code> that manages the state and actions for sandpack and a <code>ThemeProvider</code> that handles the theme and style.",
    },
    {
      title: "Custom Hooks",
      description:
        "A set of hooks gives you access to the state and offer an API for integrating custom components into sandpack.",
    },
    {
      title: "Sandpack Components",
      description:
        "We also export the smaller parts that make up the <code>&lt;Sandpack /&gt;</code> component, so you can combine them with your custom components.",
    },
    {
      title: "Sandpack Client",
      description:
        "The bundler is wrapped by a small package called <code>sandpack-client</code>, which is framework agnostic and allows you to tap into the bundler protocol.",
    },
  ],
};
