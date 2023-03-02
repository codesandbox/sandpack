import * as themes from "@codesandbox/sandpack-themes";

import { SelectorList, SelectorListButton } from "./SelectorList";
import styles from "./SelectorList.module.css";

export const ThemesList = ({ current, setCurrent, list }) => {
  const data = ["auto", "dark", "light", ...Object.keys(themes)].filter(
    (e) => e !== "default"
  );

  return (
    <SelectorList list={list} name="theme">
      {data.map((themeName) => {
        return (
          <SelectorListButton
            key={themeName}
            active={current === themeName}
            name={themeName}
            onClick={() => setCurrent(themeName)}
          >
            {typeof themes[themeName] === "object" ? (
              <span
                className={styles.palette}
                style={{
                  background: `linear-gradient(-45deg, ${themes[themeName].colors.surface1} 50%, ${themes[themeName].syntax.definition} 50%)`,
                }}
              />
            ) : themeName === "auto" ? (
              <span
                className={styles.palette}
                style={{
                  background: `linear-gradient(-45deg, #000 50%, #fff 50%)`,
                }}
              />
            ) : themeName === "dark" ? (
              <span
                className={styles.palette}
                style={{
                  background: `linear-gradient(-45deg, #000 50%, #77B7D7 50%)`,
                }}
              />
            ) : themeName === "light" ? (
              <span
                className={styles.palette}
                style={{
                  background: `linear-gradient(-45deg, #fff 50%, #7C5AE3 50%)`,
                }}
              />
            ) : null}

            <span>{themeName}</span>
          </SelectorListButton>
        );
      })}
    </SelectorList>
  );
};
