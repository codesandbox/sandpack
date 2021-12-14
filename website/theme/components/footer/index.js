/* eslint-disable @next/next/no-img-element */
import styles from "./Footer.module.scss";

export default function Footer({ ...props }) {
  return (
    <footer className={styles.container} {...props}>
      <p className={styles.warning}>
        Learn how to implement Sandpack in your project on{" "}
        <a
          href="https://sandpack.codesandbox.io/docs"
          rel="noreferrer"
          target="_blank"
        >
          <u>Sandpack Documentation</u>
        </a>
        .
      </p>
      <div className={styles.logoContainer}>
        Powered by{" "}
        <img
          alt="CodeSandbox"
          className={styles.logo}
          src="theme/codesandbox-logo.svg"
        />
      </div>
    </footer>
  );
}
