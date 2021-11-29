import styles from "./MenuHeader.module.scss";

export default function MenuHeader() {
    return (
        <nav className={styles.container}>
            <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                    <a target="_blank" href="#" className={styles.menuLink}>
                        Docs
                    </a>
                </li>
                <li className={styles.menuItem}>
                    <a target="_blank" href="#" className={styles.menuLink}>
                        GitHub
                    </a>
                </li>
            </ul>
        </nav>
    );
}
