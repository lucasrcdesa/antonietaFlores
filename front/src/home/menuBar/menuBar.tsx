import { BookIcon, FlowerIcon, HeartIcon, HouseIcon, PhoneIcon } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./menuBar.module.css";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuBar = ({ isOpen, onClose }: MenuBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string, options?: { fromHome?: boolean }) => {
    onClose();
    navigate(path, { state: options });
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
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("/produtos", { fromHome: location.pathname === "/" })}
          >
            <span className={styles.menuIcon}><FlowerIcon/></span>
            Produtos
          </button>
          <button type="button" className={styles.menuItem} onClick={() => handleNavigation("/sobre")}>
            <span className={styles.menuIcon}><BookIcon/></span>
            Sobre
          </button>
          <button type="button" className={styles.menuItem} onClick={() => handleNavigation("/contato")}>
            <span className={styles.menuIcon}><PhoneIcon/></span>
            Contato
          </button>
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