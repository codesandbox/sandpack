import { useRouter } from "next/router";

const FEEDBACK_LINK_WITH_TRANSLATIONS = {
  "en-US": "Question? Give us feedback →",
};

export default {
  project: "https://codesandbox.io",
  unstable_flexsearch: {
    codeblocks: true,
  },
  unstable_defaultShowCopyCodeButton: true,
  float: true,
  footer: { component: null },
  feedback: { component: null },

  chat: false,
  project: { icon: null },
  editLink: { text: "Edit this page on CodeSandbox →" },
};
