import HomeHeader from "../home/homeHeader/homeHeader";
import styles from "./sobreScreen.module.css";
import nosImage from "../../src/assets/capa2.jpeg";

const SobreScreen = () => {
  return (
    <div className={styles.aboutContainer}>
      <HomeHeader />

      <main className={styles.contentWrapper}>
        <section className={styles.sectionCard}>
          <h1 className={styles.title}>Sobre nós</h1>

          <div className={styles.cardContent}>
            <div className={styles.imageSection}>
              <img src={nosImage} alt="Equipe Antonieta Flores" className={styles.aboutImage} />
            </div>

            <div className={styles.textSection}>
              <p className={styles.text}>
                Somos uma empresa familiar que realiza o sonho de trabalhar com produções florais — um sonho que nasceu ainda na infância, quando nossa matriarca, Antonieta, nos ensinou a admirar a delicadeza e o cuidado com flores e plantas. Foi com ela que aprendemos a transformar simples folhagens e flores em belos arranjos, criando composições que vão do estilo mais simples ao mais sofisticado, sempre com personalidade.
              </p>
              <p className={styles.text}>
                Hoje, a empresa Antonieta Flores leva seu nome como forma de homenagem e inspiração. Com carinho e dedicação, nossa missão é criar produtos de alta qualidade que atendam às necessidades do mercado e superem as expectativas dos nossos clientes, oferecendo flores lindas, frescas e diferenciadas para cada ocasião.
              </p>
              <p className={styles.text}>
                Contamos com uma equipe de profissionais experientes e apaixonados pelo que fazem, comprometidos em entregar resultados excepcionais e em construir relacionamentos duradouros com nossos clientes.
              </p>

              <div className={styles.signature}>
                <p className={styles.nameRole}>
                  <strong>Ana Paula Rodrigues</strong>
                </p>
                <p className={styles.signatureTitle}>Designer Floral</p>
                <p className={styles.signatureTitle}>Especialista em buquês de noivas</p>

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SobreScreen;