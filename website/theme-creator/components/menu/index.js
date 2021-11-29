import styles from "./Menu.module.scss";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import React, {
  Children,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

export default function Menu() {
  const { asPath } = useRouter();
  const [activeSlider, setActiveSlider] = useState({
    x: 0,
    width: 0,
  });
  const container = useRef(null);
  const linkRef = [useRef(null), useRef(null), useRef(null)];

  useLayoutEffect(() => {
    const positionCalc = () => {
      linkRef.map((element) => {
        const linkEl = element.current;
        linkEl.classList.remove(styles.active);
        if (linkEl.getAttribute("href") === asPath) {
          linkEl.classList.add(styles.active);

          setActiveSlider({
            x: linkEl.offsetLeft + "px",
            width: linkEl.offsetWidth + "px",
          });
        }
        linkEl.onclick = () => {
          container.current.classList.add(styles.transitionActive);

          let timeOut;

          timeOut = setTimeout(function () {
            container.current.classList.remove(styles.transitionActive);
          }, 900);

          clearTimeout(timeOut);
        };
      });
    };

    positionCalc();
    window.addEventListener("resize", positionCalc);
    return () => window.removeEventListener("resize", positionCalc);
  }, [asPath]);

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
        <li className={styles.menuItem}>
          <Link href="/">
            <a className={styles.menuLink} ref={linkRef[0]}>
              Basic
            </a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/#advanced">
            <a className={styles.menuLink} ref={linkRef[1]}>
              Advanced
            </a>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/#library">
            <a className={styles.menuLink} ref={linkRef[2]}>
              Library
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
