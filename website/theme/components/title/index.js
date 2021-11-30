import styles from "./Title.module.scss";

export default function Title({ children, as, ...props }) {
  const TagName = as ? as : "h2";

  return (
    <TagName className={styles.heading} {...props}>
      {children}
    </TagName>
  );
}
