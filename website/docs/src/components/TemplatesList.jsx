import { SANDBOX_TEMPLATES } from "@codesandbox/sandpack-react";

import { SelectorList, SelectorListButton } from "./SelectorList";
import styles from "./SelectorList.module.css";

const logos = {
  react: "/logos/react.svg",
  // "react-ts": "/logos/react.svg",
  vue: "/logos/vue.svg",
  // "vue-ts": "/logos/vue.svg",
  vanilla: "/logos/js.svg",
  // "vanilla-ts": "/logos/ts.svg",
  angular: "/logos/angular.svg",
  svelte: "/logos/svelte.svg",
  solid: "/logos/solid.svg",
  // "test-ts": "/logos/jest.svg",
  node: "/logos/node.svg",
  "nextjs-light": "/logos/next-light.png",
  "nextjs-dark": "/logos/next-dark.png",
  "vite-react": "/logos/react.svg",
  "vite-vue": "/logos/vue.svg",
  vite: "/logos/vite.png",
  "vite-svelte": "/logos/svelte.png",
  "astro-light": "/logos/astro-light.svg",
  "astro-dark": "/logos/astro-dark.svg",
};

const Logo = ({ name }) => {
  if (logos[name]) {
    return (
      <img alt={name} className={`any ${styles.logo}`} src={logos[name]} />
    );
  }

  if (logos[`${name}-light`]) {
    return (
      <>
        <img
          alt={`${name}-light`}
          className={`light ${styles.logo}`}
          src={logos[`${name}-light`]}
        />
        <img
          alt={`${name}-dark`}
          className={`dark ${styles.logo}`}
          src={logos[`${name}-dark`]}
        />
      </>
    );
  }

  return null;
};

export const TemplatesList = ({ current, setCurrent, list }) => {
  return (
    <SelectorList list={list}>
      {Object.keys(SANDBOX_TEMPLATES).map((name) => {
        const templateName = name.startsWith("vite-")
          ? `${name.replace("vite-", "")} (Vite)`
          : name;

        if (!logos[name] && !logos[`${name}-light`]) return null;

        return (
          <SelectorListButton
            key={name}
            active={current === name}
            onClick={() => setCurrent(name)}
          >
            <Logo name={name} />
            <span>{templateName}</span>
          </SelectorListButton>
        );
      })}
    </SelectorList>
  );
};
