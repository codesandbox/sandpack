import styles from './Divider.module.scss';

export default function Divider({ ...props }) {
    return (
        <hr className={styles.container} {...props} />
    );
}