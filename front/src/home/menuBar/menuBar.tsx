import { BookIcon, FlowerIcon, HeartIcon, HouseIcon, PhoneIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import styles from "./menuBar.module.css";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuBar = ({ isOpen, onClose }: MenuBarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ""}`}
        onClick={onClose}
      />
      <nav className={`${styles.menuBar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.menuHeader}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu">
            ✕
          </button>
        </div>
        <div className={styles.menuItems}>
          <button className={styles.menuItem} onClick={() => handleNavigation("/")}>
            <span className={styles.menuIcon}><HouseIcon/></span>
            Início
          </button>
          <button className={styles.menuItem} onClick={() => handleNavigation("/produtos")}>
            <span className={styles.menuIcon}><FlowerIcon/></span>
            Produtos
          </button>
          <a href="#sobre" className={styles.menuItem} onClick={onClose}>
            <span className={styles.menuIcon}><BookIcon/></span>
            Sobre
          </a>
          <a href="#contato" className={styles.menuItem} onClick={onClose}>
            <span className={styles.menuIcon}><PhoneIcon/></span>
            Contato
          </a>
        </div>
        <div className={styles.menuFooter}>
          <p>Antonieta Flores</p>
          <span>Flores com amor <HeartIcon/></span>
        </div>
      </nav>
    </>
  );
};

export default MenuBar;