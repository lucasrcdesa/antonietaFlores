import styles from "./subscribeComponent.module.css";

const SubscribeComponent = () => {
  return (
    <div className={styles.subscribeContainer}>
      <h2 className={styles.subscribeTitle}>Se inscreva na nossa assinatura floral.</h2>
      <p className={styles.subscribeDescription}>
        Clique aqui para se registrar e receber as mais belas flores em sua casa/escritõrio todos os meses!
      </p>
      
    </div>
  );
};

export default SubscribeComponent;