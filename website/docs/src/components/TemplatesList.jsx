import { SANDBOX_TEMPLATES } from "@codesandbox/sandpack-react";

import { SelectorList, SelectorListButton } from "./SelectorList";
import styles from "./SelectorList.module.css";

const logos = {
  static: "/docs/logos/html.svg",
  react: "/docs/logos/react.svg",
  // "react-ts": "/docs/logos/react.svg",
  vue: "/docs/logos/vue.svg",
  // "vue-ts": "/docs/logos/vue.svg",
  vanilla: "/docs/logos/js.svg",
  // "vanilla-ts": "/docs/logos/ts.svg",
  angular: "/docs/logos/angular.svg",
  svelte: "/docs/logos/svelte.svg",
  solid: "/docs/logos/solid.svg",
  // "test-ts": "/docs/logos/jest.svg",
  node: "/docs/logos/node.svg",
  "nextjs-light": "/docs/logos/next-light.png",
  "nextjs-dark": "/docs/logos/next-dark.png",
  "vite-react": "/docs/logos/react.svg",
  "vite-vue": "/docs/logos/vue.svg",
  vite: "/docs/logos/vite.png",
  "vite-svelte": "/docs/logos/svelte.png",
  "astro-light": "/docs/logos/astro-light.svg",
  "astro-dark": "/docs/logos/astro-dark.svg",
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
