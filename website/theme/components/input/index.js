import styles from "./Input.module.scss";

export default function Input({ label, ...props }) {
  return (
    <label>
      <div className={styles.label}>{label}</div>
      <input className={styles.input} {...props} />
    </label>
  );
}

export function InputContainer({ children, ...props }) {
  return (
    <div className={styles.container} {...props}>
      {children}
    </div>
  );
}
