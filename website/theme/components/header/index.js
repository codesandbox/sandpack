import styles from './Header.module.scss';
import Logo from 'components/logo';
import MenuHeader from 'components/menu-header';

export default function Header({...props}) {
    return (
        <header className={styles.container} {...props}>
            <Logo />
            <MenuHeader />
        </header>
    );
}
