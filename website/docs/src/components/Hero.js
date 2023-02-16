import styles from "./Hero.module.css";

export default function Hero({ title, subtitle }) {
  return (
    <div>
      <h1 className={styles.title}>{title}</h1>
      <h2 className={styles.subtitle}>{subtitle}</h2>
    </div>
  );
}
