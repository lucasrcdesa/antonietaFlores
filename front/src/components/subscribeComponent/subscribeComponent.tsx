import styles from "./subscribeComponent.module.css";

const SubscribeComponent = () => {
  const message = "Olá! Tenho interesse na assinatura floral da Antonieta Flores.";
  const whatsappUrl = `https://wa.me/5561999767896?text=${encodeURIComponent(message)}`;

  return (
    <a
      className={styles.subscribeContainer}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp sobre assinatura floral"
    >
      <h2 className={styles.subscribeTitle}>Se inscreva na nossa assinatura floral. (em breve)</h2>
      <p className={styles.subscribeDescription}>
        Clique aqui para se registrar e receber as mais belas flores em sua casa/escritório todos os meses!
      </p>
      
    </a>
  );
};

export default SubscribeComponent;