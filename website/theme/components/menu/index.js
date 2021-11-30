import styles from "./Menu.module.scss";
import React, { useRef, useState } from "react";

export default function Menu({ setTab }) {
  const [activeSlider, setActiveSlider] = useState({
    x: 0,
    width: "79px",
  });
  const container = useRef(null);

  const onClick = (event) => {
    setActiveSlider({
      x: event.target.offsetLeft + "px",
      width: event.target.offsetWidth + "px",
    });
  };

  return (
    <nav
      ref={container}
      className={styles.container}
      style={{
        "--target-x": `${activeSlider.x}`,
        "--target-width": `${activeSlider.width}`,
      }}
    >
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={onClick}>
          <button onClick={() => setTab("basic")}>
            <a className={styles.menuLink}>Basic</a>
          </button>
        </li>
        <li className={styles.menuItem} onClick={onClick}>
          <button onClick={() => setTab("advanced")}>
            <a className={styles.menuLink}>Advanced</a>
          </button>
        </li>
        <li className={styles.menuItem} onClick={onClick}>
          <button onClick={() => setTab("library")}>
            <a className={styles.menuLink}>Library</a>
          </button>
        </li>
      </ul>
    </nav>
  );
}
