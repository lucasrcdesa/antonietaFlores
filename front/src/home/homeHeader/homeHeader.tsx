import { useState } from "react";
import styles from "./HomeHeader.module.css";
import logo from "../../assets/logo_transparente.png";
import MenuBar from "../menuBar/menuBar";

const HomeHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHomeButton = () => {
   navigation.navigate('/');
  }
const handleProdutosButton = () => {
   navigation.navigate('/produtos');
  }
const handleSobreButton = () => {
   navigation.navigate('/sobre');
  }
const handleContatoButton = () => {
   navigation.navigate('/contato');
  }

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
            <a href="#home" className={styles.navButton} onClick={handleHomeButton}>Início</a>
            <a href="#produtos" className={styles.navButton} onClick={handleProdutosButton}>Produtos</a>
            <a href="#sobre" className={styles.navButton} onClick={handleSobreButton}>Sobre</a>
            <a href="#contato" className={styles.navButton} onClick={handleContatoButton}>Contato</a>
          </nav>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;