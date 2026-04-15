import { useNavigate } from "react-router-dom";
import styles from "./productScreen.module.css";
import HomeHeader from "../../home/homeHeader/homeHeader";

// Dados mock para exemplo
const mockProducts = [
  {
    id: 1,
    name: "Buquê Romântico",
    description: "Rosas vermelhas com folhagens delicadas",
    price: 89.90,
    category: "Buquês",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400"
  },
  {
    id: 2,
    name: "Arranjo Primavera",
    description: "Mix de flores coloridas da estação",
    price: 129.90,
    category: "Arranjos",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400"
  },
  {
    id: 3,
    name: "Cesta de Girassóis",
    description: "Girassóis frescos em cesta rústica",
    price: 159.90,
    category: "Cestas",
    image: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400"
  },
  {
    id: 4,
    name: "Mimo Especial",
    description: "Pequeno arranjo para presentear",
    price: 59.90,
    category: "Mimos",
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400"
  },
  {
    id: 5,
    name: "Buquê de Noiva",
    description: "Elegante buquê para casamentos",
    price: 249.90,
    category: "Noivas",
    image: "https://images.unsplash.com/photo-1522057306606-8d84dfe6b612?w=400"
  },
  {
    id: 6,
    name: "Arranjo Tropical",
    description: "Flores tropicais exóticas",
    price: 189.90,
    category: "Arranjos",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400"
  },
];

const ProductScreen = () => {
  const navigate = useNavigate();

  const handleProductClick = (id: number) => {
    navigate(`/produtos/${id}`);
  };

  return (
    <div className={styles.container}>
      <HomeHeader />
      
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <h1 className={styles.title}>Nossos Produtos</h1>
          <p className={styles.subtitle}>
            Descubra arranjos únicos feitos com carinho para cada ocasião especial
          </p>
        </section>

        <section className={styles.filtersSection}>
          <button className={`${styles.filterBtn} ${styles.active}`}>Todos</button>
          <button className={styles.filterBtn}>Buquês</button>
          <button className={styles.filterBtn}>Arranjos</button>
          <button className={styles.filterBtn}>Cestas</button>
          <button className={styles.filterBtn}>Mimos</button>
          <button className={styles.filterBtn}>Noivas</button>
        </section>

        <section className={styles.productsGrid}>
          {mockProducts.map((product) => (
            <div 
              key={product.id} 
              className={styles.productCard}
              onClick={() => handleProductClick(product.id)}
            >
              <div 
                className={styles.productImage}
                style={{ backgroundImage: `url(${product.image})` }}
              >
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  <button className={styles.viewBtn}>Ver mais</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProductScreen;
