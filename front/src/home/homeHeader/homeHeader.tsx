import { useState } from "react";
import styles from "./HomeHeader.module.css";
import logo from "../../assets/logo_transparente.png";
import MenuBar from "../menuBar/menuBar";

const HomeHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MenuBar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className={styles.homeHeader}>
        <div className={styles.leftSection}>
          <div
            className={styles.menuIcon}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menu"
            tabIndex={0}
            role="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={styles.logoContainer}>
            <img src={logo} alt="Antonieta Flores" className={styles.logo} />
          </div>
        </div>

        <div className={styles.rightSection}>
          <nav className={styles.navButtons}>
            <a href="#home" className={styles.navButton}>Início</a>
            <a href="#produtos" className={styles.navButton}>Produtos</a>
            <a href="#sobre" className={styles.navButton}>Sobre</a>
            <a href="#contato" className={styles.navButton}>Contato</a>
          </nav>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;