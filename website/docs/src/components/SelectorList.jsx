import { useEffect, useRef } from "react";

import styles from "./SelectorList.module.css";

export const SelectorListButton = ({ children, onClick, active }) => {
  const className = `${styles.item} ${
    active
      ? `${styles.itemSelected} dark:nx-bg-primary-500/10 nx-bg-primary-500/10 nx-text-primary-500`
      : ""
  } nx-bg-black/[.03] dark:nx-bg-gray-50/10`;

  return (
    <button className={className} data-select={active} onClick={onClick}>
      {children}
    </button>
  );
};

export const SelectorList = ({ list, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const element = ref.current;
      if (element) {
        const active = element.querySelector("[data-select='true']");

        active?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
      }
    }, 300);
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.container} ${list ? styles.scrollList : ""}`}
    >
      {children}
    </div>
  );
};
