import styles from "./subscribeComponent.module.css";

const SubscribeComponent = () => {
  const message = "Olá! Tenho interesse na assinatura floral da Antonieta Flores.";
  const whatsappUrl = `https://wa.me/5561999767896?text=${encodeURIComponent(message)}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenWhatsApp();
    }
  };

  return (
    <div
      className={styles.subscribeContainer}
      onClick={handleOpenWhatsApp}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Falar no WhatsApp sobre assinatura floral"
    >
      <h2 className={styles.subscribeTitle}>Se inscreva na nossa assinatura floral. (em breve)</h2>
      <p className={styles.subscribeDescription}>
        Clique aqui para se registrar e receber as mais belas flores em sua casa/escritório todos os meses!
      </p>
      
    </div>
  );
};

export default SubscribeComponent;