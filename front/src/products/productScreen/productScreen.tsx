import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import styles from "./productScreen.module.css";
import HomeHeader from "../../home/homeHeader/homeHeader";
import type { ProductProps } from "../../interfaces/productProps";
import ProductImage from "../../components/productImage/productImage";

interface ProductRouteState {
  fromHome?: boolean;
}

const INITIAL_PRODUCTS_CHUNK = 6;

const formatProductPrice = (price: number): string => {
  if (price <= 0) {
    return "A consultar";
  }

  return `R$ ${price.toFixed(2).replace(".", ",")}`;
};

const ProductScreen = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [visibleProducts, setVisibleProducts] = useState<ProductProps[]>([]);
  const [loadingRemainingProducts, setLoadingRemainingProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as ProductRouteState | null;
  const [showEntryTransition, setShowEntryTransition] = useState(Boolean(routeState?.fromHome));

  const preloadProductImages = useCallback(async (items: ProductProps[]) => {
    const urls = items
      .map((item) => item.imagemUrl)
      .filter((url): url is string => Boolean(url))
      .slice(0, 8);

    await Promise.all(
      urls.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          })
      )
    );
  }, []);

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

        // Nao bloqueia a exibicao dos cards enquanto as imagens sao pré-carregadas.
        void preloadProductImages(activeProducts);
      } else if (response.status === 401) {
        // Token expirado, redirecionar para login
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate, preloadProductImages]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "Todos") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.categoria === category);
      setFilteredProducts(filtered);
    }
  };

  const handleProductClick = (product: ProductProps) => {
    navigate(`/produtos/${product.id}`, { state: { product } });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (filteredProducts.length <= INITIAL_PRODUCTS_CHUNK) {
      setVisibleProducts(filteredProducts);
      setLoadingRemainingProducts(false);
      return;
    }

    setVisibleProducts(filteredProducts.slice(0, INITIAL_PRODUCTS_CHUNK));
    setLoadingRemainingProducts(true);

    const progressiveRenderTimer = window.setTimeout(() => {
      setVisibleProducts(filteredProducts);
      setLoadingRemainingProducts(false);
    }, 140);

    return () => window.clearTimeout(progressiveRenderTimer);
  }, [filteredProducts]);

  useEffect(() => {
    if (!showEntryTransition) {
      return;
    }

    const transitionTimer = window.setTimeout(() => {
      setShowEntryTransition(false);
    }, 700);

    return () => window.clearTimeout(transitionTimer);
  }, [showEntryTransition]);

  const isTransitioning = loading || showEntryTransition;

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
          {isTransitioning ? (
            <div className={styles.transitionState}>
              <p>Preparando nossa vitrine para voce...</p>
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonTextShort}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum produto encontrado nesta categoria.</p>
            </div>
          ) : (
            visibleProducts.map((product) => (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => handleProductClick(product)}
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
                      {formatProductPrice(product.preco)}
                    </span>
                    <button className={styles.viewBtn}>Ver mais</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {!isTransitioning && loadingRemainingProducts && (
          <p className={styles.loadingMore}>Carregando mais produtos...</p>
        )}
      </main>
    </div>
  );
};

export default ProductScreen;
