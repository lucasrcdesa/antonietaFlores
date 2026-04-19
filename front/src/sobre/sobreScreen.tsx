import HomeHeader from "../home/homeHeader/homeHeader";
import styles from "./sobreScreen.module.css";

const SobreScreen = () => {
  return (
    <div className={styles.aboutContainer}>
      <HomeHeader />

      <main className={styles.contentWrapper}>
        <section className={styles.sectionCard}>
          <h1 className={styles.title}>Sobre a Antonieta</h1>

          <p className={styles.text}>
            A Antonieta é uma floricultura dedicada a oferecer as mais belas flores e arranjos para todas as ocasiões. Fundada em 2020, nossa missão é trazer alegria e beleza para a vida de nossos clientes através de nossas criações florais únicas e personalizadas.
          </p>
          <p className={styles.text}>
            Na Antonieta, acreditamos que cada flor tem uma história para contar e um significado especial. Por isso, selecionamos cuidadosamente cada flor que utilizamos em nossos arranjos, garantindo qualidade e frescor em cada produto que entregamos.
          </p>
          <p className={styles.text}>
            Além de nossos arranjos personalizados, também oferecemos uma variedade de buquês prontos para presentear ou decorar seu espaço. Seja para um aniversário, casamento, ou simplesmente para alegrar o dia de alguém, temos a opção perfeita para você.
          </p>
          <p className={styles.text}>
            Nosso compromisso é proporcionar uma experiência de compra excepcional, desde o momento em que você escolhe seu arranjo até a entrega em sua porta. Estamos sempre prontos para ajudar e garantir que você encontre a flor perfeita para cada ocasião.
          </p>
          <p className={styles.text}>
            Obrigado por escolher a Antonieta Flores. Estamos ansiosos para fazer parte dos seus momentos especiais com nossas flores encantadoras!
          </p>
        </section>
      </main>
    </div>
  );
};

export default SobreScreen;