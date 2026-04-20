import { InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import styles from "./contact.module.css";

const Contact: React.FC = () => {
  return (
    <div className={styles.contactContainer}>
      <h1>Contato</h1>
      <p>Entre em contato conosco para mais informações sobre nossos produtos e serviços.</p>
      <a href="mailto:email@antonieta.com.br" className={styles.emailLink}>
        email@antonieta.com.br
      </a>

      <div className={styles.contactRow}>
        <WhatsappLogoIcon className={`${styles.icon} ${styles.whatsappIcon}`} weight="regular" />
        <a href="https://wa.me/5561999767896" target="_blank" rel="noopener noreferrer" className={styles.rowText}>
          (61) 99976-7896
        </a>
      </div>

      <div className={styles.contactRow}>
        <InstagramLogoIcon className={`${styles.icon} ${styles.instagramIcon}`} weight="regular" />
        <a href="https://www.instagram.com/antonietaflores_?igsh=bGZjdm14emgzOWQ4" target="_blank" rel="noopener noreferrer" className={styles.rowText}>
          @antonietaflores
        </a>
      </div>
      <div className={styles.contactRow}>
        <a href="https://wa.me/5561999767896" target="_blank" rel="noopener noreferrer" className={styles.rowText}>
          Site criado por Lucas Rodrigues - (61) 99662-9077
        </a>
      </div>
    </div>
  );
};

export default Contact;