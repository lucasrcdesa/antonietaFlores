import styles from "./aboutUs.module.css";
import eventosArranjo from "../../assets/eventosArranjo.jpeg";




const AboutUs = () => {
    return (
        <div className={styles.aboutUsContainer }>
            <div className={styles.sectionTitle}>
               <h1>Sobre Nós</h1>
                <p className={styles.text}>
                Somos uma empresa familiar que realiza o sonho de trabalhar com produções florais — um sonho que nasceu ainda na infância, quando nossa matriarca, Antonieta, nos ensinou a admirar a delicadeza e o cuidado com flores e plantas. Foi com ela que aprendemos a transformar simples folhagens e flores em belos arranjos, criando composições que vão do estilo mais simples ao mais sofisticado, sempre com personalidade.
              </p>
              <p className={styles.text}>
                Hoje, a empresa Antonieta Flores leva seu nome como forma de homenagem e inspiração. Com carinho e dedicação, nossa missão é criar produtos de alta qualidade que atendam às necessidades do mercado e superem as expectativas dos nossos clientes, oferecendo flores lindas, frescas e diferenciadas para cada ocasião.
              </p>
              <p className={styles.text}>
                Contamos com uma equipe de profissionais experientes e apaixonados pelo que fazem, comprometidos em entregar resultados excepcionais e em construir relacionamentos duradouros com nossos clientes.
              </p>
            </div>
            <div className={styles.sectionImage}>
                <img src={eventosArranjo} alt="Sobre Nós" className={styles.image} />
            </div>
            
        </div>
    );
};

export default AboutUs;