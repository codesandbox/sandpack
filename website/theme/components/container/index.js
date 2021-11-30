import { useEffect, useRef, useState } from "react";
import { useClipboard } from "use-clipboard-copy";

import styles from "./Container.module.scss";

export default function Container({ children }) {
  return <main className={styles.container}>{children}</main>;
}

//ContainerControls

export function ContainerControls({ children }) {
  return <div className={styles.containerControls}>{children}</div>;
}

//ContainerCode

export function ContainerCode({ children }) {
  return <div className={styles.containerCode}>{children}</div>;
}

//ContainerPanels

export function ContainerPanels({ children, tab }) {
  const [tabState, setTabState] = useState(0);
  const container = useRef(null);

  useEffect(() => {
    tab === "basic" && setTabState(0);
    tab === "advanced" && setTabState(1);
    tab === "library" && setTabState(2);
  }, [tab, tabState]);

  return (
    <div
      ref={container}
      className={styles.containerPanels}
      style={{ "--state": tabState }}
    >
      {children}
    </div>
  );
}

//ContainerColors

export function ContainerColors({ children, isActive }) {
  return (
    <div
      className={`${styles.containerColors} ${
        isActive === true ? styles.containerColorsActive : ""
      }`}
    >
      {children}
    </div>
  );
}

//ContainerPre

export function ContainerPre({ children }) {
  const clipboard = useClipboard();

  const selectAll = (e) => {
    let pre = e.target;
    if (pre) {
      let range = new Range();
      range.setStart(pre, 0);
      range.setEnd(pre, 1);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);
      clipboard.copy(children);
    }
  };

  return (
    <div className={styles.containerPre}>
      <pre onClick={selectAll}>{children}</pre>
    </div>
  );
}

//ContainerSandpack

export function ContainerSandpack({ children }) {
  return <div className={styles.containerSandpack}>{children}</div>;
}
