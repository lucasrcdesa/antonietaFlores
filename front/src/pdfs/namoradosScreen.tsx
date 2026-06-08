import HomeHeader from "../home/homeHeader/homeHeader";
import styles from "./namoradosScreen.module.css";
import namoradosPdf from "./namorados.pdf?url";

const NamoradosScreen = () => {
  return (
    <div className={styles.pageContainer}>
      <HomeHeader />

      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Dia dos Namorados</h1>
        <p className={styles.subtitle}>Catálogo especial de arranjos para a data mais romântica do ano</p>
      </div>

      <div className={styles.content}>
        <iframe
          src={namoradosPdf}
          className={styles.pdfFrame}
          title="Catálogo Dia dos Namorados"
        />
      </div>
    </div>
  );
};

export default NamoradosScreen;
