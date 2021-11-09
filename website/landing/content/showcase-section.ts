interface Feature {
  title: string;
  description: string;
}

interface ShowcaseSection {
  title: string;
  features: Feature[];
}

export const content: ShowcaseSection = {
  title: "Showcase",
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
