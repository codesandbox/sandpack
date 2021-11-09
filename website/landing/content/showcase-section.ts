import type { HighlightedText } from "./shared-types";

interface Feature {
  title: string;
  description: string;
}

interface ShowcaseSection {
  title: HighlightedText[];
  features: Feature[];
}

export const content: ShowcaseSection = {
  title: [{ text: "Showcase", highlight: false }],
  features: [
    {
      title: "MDX",
      description:
        "Quisque commodo finibus metus nec viverra. Duis ultricies congue arcu, nec efficitur nibh pellentesque sed. Nullam convallis mi sem.",
    },
    {
      title: "Sound Demo",
      description:
        "Quisque commodo finibus metus nec viverra. Duis ultricies congue arcu, nec efficitur nibh pellentesque sed. Nullam convallis mi sem.",
    },
    {
      title: "Multiple Previews",
      description:
        "Quisque commodo finibus metus nec viverra. Duis ultricies congue arcu, nec efficitur nibh pellentesque sed. Nullam convallis mi sem.",
    },
    {
      title: "Step by step code",
      description:
        "Quisque commodo finibus metus nec viverra. Duis ultricies congue arcu, nec efficitur nibh pellentesque sed. Nullam convallis mi sem.",
    },
  ],
};
