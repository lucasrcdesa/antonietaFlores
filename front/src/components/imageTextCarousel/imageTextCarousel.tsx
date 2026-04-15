import { useEffect, useState } from "react";
import florbackground  from "../../assets/florbackground.png";
import background  from "../../assets/background.jpg";
import vite  from "../../assets/vite.svg";




import styles from "./imageTextCarousel.module.css";

const slides = [
  {
    image: florbackground,
    title: "Bem-vindo à Antonieta Flores!",
    description:
      "Flores frescas, arranjos exclusivos e carinho em cada detalhe. Deixe seu dia mais colorido com a gente!",
  },
  {
    image: background,
    title: "Arranjos feitos com amor",
    description:
      "Escolha o presente perfeito para cada ocasião e surpreenda quem você ama com delicadeza e estilo.",
  },
  {
    image: vite,
    title: "Entrega rápida e segura",
    description:
      "Do pedido à entrega, cuidamos de cada passo para que suas flores cheguem lindas e frescas.",
  },
];

const ImageTextCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        <div className={styles.slide}>
          <img src={slide.image} alt={slide.title} className={styles.imgView} />
        </div>
        <div className={styles.text}>
          <h2>{slide.title}</h2>
          <p>{slide.description}</p>
        </div>
      </div>

      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === current ? styles.active : ""}`}
            onClick={() => setCurrent(index)}
            aria-label={`Ver banner ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageTextCarousel;