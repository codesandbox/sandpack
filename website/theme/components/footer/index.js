import styles from "./Footer.module.scss";

export default function Footer({ ...props }) {
    return (
        <footer className={styles.container} {...props}>
            <p className={styles.warning}>
                Read more about how to implement Sandpack on your project on{" "}
                <a href="#" target="_blank">
                    <u>Sandpack Documentation</u>
                </a>
                .
            </p>
            <div className={styles.logoContainer}>
                Powered by{" "}
                <img className={styles.logo} src="/codesandbox-logo.svg" />
            </div>
        </footer>
    );
}
