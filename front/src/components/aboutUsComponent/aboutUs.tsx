import styles from "./aboutUs.module.css";
import eventosArranjo from "../../assets/eventosArranjo.jpeg";


const handleNavigateSobre = () => {
    navigation.navigate("/sobre");
}

const AboutUs = () => {
    return (
        <div className={styles.aboutUsContainer }onClick={handleNavigateSobre}>
            <div className={styles.sectionTitle}>
               <h1>Sobre Nós</h1>
            <p>Somos uma empresa dedicada a fornecer soluções inovadoras para nossos clientes. Nossa missão é criar produtos de alta qualidade que atendam às necessidades do mercado e superem as expectativas dos nossos clientes.</p>
            <p>Com uma equipe de profissionais experientes e apaixonados pelo que fazem, estamos comprometidos em entregar resultados excepcionais e construir relacionamentos duradouros com nossos clientes.</p>
            </div>
            <div className={styles.sectionImage}>
                <img src={eventosArranjo} alt="Sobre Nós" className={styles.image} />
            </div>
            
        </div>
    );
};

export default AboutUs;