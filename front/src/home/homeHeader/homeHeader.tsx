import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./HomeHeader.module.css";
import logo from "../../assets/logo_transparente.png";
import MenuBar from "../menuBar/menuBar";

const HomeHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeButton = () => {
    navigate("/");
  };

  const handleProdutosButton = () => {
    navigate("/produtos", { state: { fromHome: location.pathname === "/" } });
  };

  const handleSobreButton = () => {
    navigate("/sobre");
  };

  const handleContatoButton = () => {
    navigate("/contato");
  };

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
            <button type="button" className={styles.navButton} onClick={handleHomeButton}>Início</button>
            <button type="button" className={styles.navButton} onClick={handleProdutosButton}>Produtos</button>
            <button type="button" className={styles.navButton} onClick={handleSobreButton}>Sobre</button>
            <button type="button" className={styles.navButton} onClick={handleContatoButton}>Contato</button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;