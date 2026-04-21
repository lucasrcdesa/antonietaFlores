import HomeHeader from "../home/homeHeader/homeHeader";
import styles from "./contactScreen.module.css";

const ContactScreen = () => {
  return (
    <div className={styles.contactContainer}>
      <HomeHeader />

      <main className={styles.contentWrapper}>
        <section className={styles.sectionCard}>
          <h1 className={styles.title}>Contato</h1>
          <p className={styles.description}>
            Entre em contato conosco para mais informações sobre nossos produtos e serviços.
          </p>

          <div className={styles.contactGrid}>
            <article className={styles.contactItem}>
              <h2>Email</h2>
              <p>contato@antonieta.com</p>
            </article>

            <article className={styles.contactItem}>
              <h2>Telefone</h2>
              <p>(61) 99976-7896</p>
            </article>

            <article className={styles.contactItem}>
              <h2>Atendimento</h2>
              <p>Segunda a sexta, das 9h às 17h</p>
              <p>Sábado, das 9h às 14h</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactScreen;