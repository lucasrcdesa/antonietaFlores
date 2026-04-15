import { InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import styles from "./contact.module.css";

const Contact: React.FC = () => {
  return (
    <div className={styles.contactContainer}>
      <h1>Contato</h1>
      <p>Entre em contato conosco para mais informações sobre nossos produtos e serviços.</p>
      <h2>email@antonieta.com.br</h2>
      <div className={styles.whatsApp}>
        <WhatsappLogoIcon size={32} color="#25D366" weight="bold"  />
        <h3 >(61) 99976-7896</h3>
      </div>
      <div className={styles.whatsApp}>
        <InstagramLogoIcon size={32} color="#E1306C" weight="bold"  />
        <a href="https://www.instagram.com/antonietaflores_?igsh=bGZjdm14emgzOWQ4" target="_blank" rel="noopener noreferrer">(@antonietaflores)</a>
      </div>
      
      
    </div>
  );
};

export default Contact;