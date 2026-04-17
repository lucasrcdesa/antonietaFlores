import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import styles from "./productScreen.module.css";
import HomeHeader from "../../home/homeHeader/homeHeader";
import type { ProductProps } from "../../interfaces/productProps";
import ProductImage from "../../components/productImage/productImage";

const ProductScreen = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/produtos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: ProductProps[] = await response.json();
        // Filtrar apenas produtos ativos
        const activeProducts = data.filter(product => product.ativo);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);

        // Extrair categorias únicas e ordenar alfabeticamente
        const uniqueCategories = [...new Set(activeProducts.map(product => product.categoria))].sort();
        setCategories(uniqueCategories);
      } else if (response.status === 401) {
        // Token expirado, redirecionar para login
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "Todos") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.categoria === category);
      setFilteredProducts(filtered);
    }
  };

  const handleProductClick = (id: number) => {
    navigate(`/produtos/${id}`);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
          <button
            className={`${styles.filterBtn} ${selectedCategory === "Todos" ? styles.active : ""}`}
            onClick={() => handleCategoryFilter("Todos")}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ""}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </section>

        <section className={styles.productsGrid}>
          {loading ? (
            <div className={styles.loading}>
              <p>Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum produto encontrado nesta categoria.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => handleProductClick(product.id!)}
              >
                <div className={styles.productImage}>
                  <ProductImage
                    imageUrl={product.imagemUrl}
                    alt={product.nome}
                    className={styles.productImageContent}
                  />
                  <span className={styles.categoryBadge}>{product.categoria}</span>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.nome}</h3>
                  <p className={styles.productDescription}>{product.descricao}</p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>
                      R$ {product.preco.toFixed(2).replace(".", ",")}
                    </span>
                    <button className={styles.viewBtn}>Ver mais</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductScreen;
