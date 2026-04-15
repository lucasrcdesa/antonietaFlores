import { useParams, useNavigate } from "react-router-dom";
import styles from "./productDetailScreen.module.css";
import HomeHeader from "../../home/homeHeader/homeHeader";

// Dados mock para exemplo
const mockProducts = [
  {
    id: 1,
    name: "Buquê Romântico",
    description: "Rosas vermelhas com folhagens delicadas",
    fullDescription: "Um lindo buquê composto por rosas vermelhas frescas, combinadas com folhagens delicadas e acabamento especial. Perfeito para expressar amor e carinho em momentos especiais como aniversários, datas comemorativas ou simplesmente para demonstrar afeto.",
    price: 89.90,
    category: "Buquês",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600",
    includes: ["12 rosas vermelhas", "Folhagens decorativas", "Laço de cetim", "Embalagem especial"],
  },
  {
    id: 2,
    name: "Arranjo Primavera",
    description: "Mix de flores coloridas da estação",
    fullDescription: "Arranjo vibrante com as mais belas flores da estação, trazendo cores e alegria para qualquer ambiente. Cada arranjo é único, montado com carinho e atenção aos detalhes.",
    price: 129.90,
    category: "Arranjos",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600",
    includes: ["Flores variadas da estação", "Vaso decorativo", "Cartão personalizado"],
  },
  {
    id: 3,
    name: "Cesta de Girassóis",
    description: "Girassóis frescos em cesta rústica",
    fullDescription: "Linda cesta rústica repleta de girassóis frescos, perfeita para alegrar o dia de quem você ama. Os girassóis simbolizam felicidade, vitalidade e energia positiva.",
    price: 159.90,
    category: "Cestas",
    image: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=600",
    includes: ["6 girassóis frescos", "Cesta de vime", "Palha decorativa", "Laço especial"],
  },
  {
    id: 4,
    name: "Mimo Especial",
    description: "Pequeno arranjo para presentear",
    fullDescription: "Um mimo delicado e encantador, perfeito para presentear em qualquer ocasião. Compacto e cheio de charme, ideal para demonstrar carinho de forma simples e elegante.",
    price: 59.90,
    category: "Mimos",
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600",
    includes: ["Flores mistas", "Mini vaso", "Embalagem decorativa"],
  },
  {
    id: 5,
    name: "Buquê de Noiva",
    description: "Elegante buquê para casamentos",
    fullDescription: "Buquê elegante e sofisticado, especialmente criado para o dia mais importante da sua vida. Trabalhamos com flores nobres e acabamento impecável para tornar seu momento ainda mais especial.",
    price: 249.90,
    category: "Noivas",
    image: "https://images.unsplash.com/photo-1522057306606-8d84dfe6b612?w=600",
    includes: ["Flores nobres selecionadas", "Cabo decorado", "Fita de cetim", "Caixa protetora"],
  },
  {
    id: 6,
    name: "Arranjo Tropical",
    description: "Flores tropicais exóticas",
    fullDescription: "Arranjo exuberante com flores tropicais que trazem um toque de natureza e exotismo para qualquer ambiente. Cores vibrantes e formas únicas que encantam.",
    price: 189.90,
    category: "Arranjos",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600",
    includes: ["Helicônias", "Strelitzias", "Folhagens tropicais", "Vaso moderno"],
  },
];

const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className={styles.container}>
        <HomeHeader />
        <div className={styles.notFound}>
          <h2>Produto não encontrado</h2>
          <button onClick={() => navigate("/produtos")} className={styles.backBtn}>
            Voltar para produtos
          </button>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")}`;
    const phone = "5511999999999"; // Número de exemplo
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className={styles.container}>
      <HomeHeader />
      
      <main className={styles.mainContent}>
        <button onClick={() => navigate("/produtos")} className={styles.backLink}>
          ← Voltar para produtos
        </button>

        <div className={styles.productDetail}>
          <div className={styles.imageSection}>
            <img src={product.image} alt={product.name} className={styles.productImage} />
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productDescription}>{product.fullDescription}</p>

            <div className={styles.includesSection}>
              <h3>O que está incluso:</h3>
              <ul className={styles.includesList}>
                {product.includes?.map((item, index) => (
                  <li key={index}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.price}>
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className={styles.actionsSection}>
              <button onClick={handleWhatsApp} className={styles.whatsappBtn}>
                📱 Pedir pelo WhatsApp
              </button>
              <button className={styles.favoriteBtn}>
                ♡ Adicionar aos favoritos
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailScreen;
