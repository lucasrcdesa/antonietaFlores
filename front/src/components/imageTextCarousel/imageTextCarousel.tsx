import { useEffect, useState } from "react";
import capa from "../../assets/capa.jpeg";
import capa2 from "../../assets/capa2.jpeg";
import capa3 from "../../assets/capa3.jpeg";




import styles from "./imageTextCarousel.module.css";

const slides = [
  {
    image: capa2,
    title: "Bem-vindo à Antonieta Flores!",
    description:
      "Flores frescas, arranjos exclusivos e carinho em cada detalhe. Deixe seu dia mais colorido com a gente!",
  },
  {
    image: capa,
    title: "Arranjos feitos com amor",
    description:
      "Escolha o presente perfeito para cada ocasião e surpreenda quem você ama com delicadeza e estilo.",
  },
  {
    image: capa3,
    title: "Entrega rápida e segura",
    description:
      "Do pedido à entrega, cuidamos de cada passo para que suas flores cheguem lindas e frescas.",
  },
];

const ImageTextCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[current];
  const isCurrentSlideLoaded = Boolean(loadedSlides[current]);

  const handleImageLoad = () => {
    setLoadedSlides((prev) => {
      if (prev[current]) {
        return prev;
      }
      return { ...prev, [current]: true };
    });
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        <div className={styles.slide}>
          {!isCurrentSlideLoaded && (
            <div className={styles.imageLoader} aria-label="Carregando banner">
              <div className={styles.loaderSpinner}></div>
            </div>
          )}
          <img
            src={slide.image}
            alt={slide.title}
            className={`${styles.imgView} ${isCurrentSlideLoaded ? styles.imgVisible : styles.imgHidden}`}
            onLoad={handleImageLoad}
          />
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