import { useEffect, useRef, useState } from "react";

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
  return <div className={styles.containerPre}>{children}</div>;
}

//ContainerSandpack

export function ContainerSandpack({ children }) {
  return <div className={styles.containerSandpack}>{children}</div>;
}
