import styles from "./mainProducts.module.css";
import heroImage from "../../assets/hero.png";
import florbackground from "../../assets/florbackground.png";
import backgroundImage from "../../assets/background.jpg";

const cards = [
  {
    id: "sectionBuque",
    title: "Buquês",
    description: "Arranjos elegantes e delicados, perfeitos para presentear em qualquer ocasião.",
    image: heroImage,
    reverse: false,
  },
  {
    id: "sectionMimo",
    title: "Mimos",
    description: "Pequenos gestos florais com grande impacto visual e muito charme.",
    image: florbackground,
    reverse: true,
  },
  {
    id: "sectionCaixa",
    title: "Caixas",
    description: "Combinações sofisticadas dentro de caixas especiais para surpreender.",
    image: backgroundImage,
    reverse: false,
  },
  {
    id: "sectionNoivas",
    title: "Noivas",
    description: "Detalhes florais exclusivos para tornar o seu dia ainda mais inesquecível.",
    image: heroImage,
    reverse: true,
  },
  {
    id: "sectionObs",
    title: "Eventos",
    description: "Decoração floral personalizada para eventos com estilo e elegância.",
    image: florbackground,
    reverse: false,
  },
];

const MainProducts = () => {
  return (
    <div className={styles.mainProductsContainer}>
      <div className={styles.sectionTitle}>
        <h2>Nossos Produtos</h2>
      </div>
      <div className={styles.gridContainer}>
        {cards.map((card) => (
          <article
            key={card.id}
            className={`${styles.card} ${styles[card.id]} ${card.reverse ? styles.reverse : ""}`}
          >
            <div
              className={styles.cardImage}
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className={styles.cardText}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MainProducts;
