import styles from "./BackLink.module.css";

export default function BackLink() {
  return (
    <a className={styles.link} href="https://sandpack.codesandbox.io">
      Back to sandpack.codesandbox.io
    </a>
  );
}
