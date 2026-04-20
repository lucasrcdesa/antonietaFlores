import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./productDetailScreen.module.css";
import HomeHeader from "../../home/homeHeader/homeHeader";
import type { ProductProps } from "../../interfaces/productProps";
import ProductImage from "../../components/productImage/productImage";

const ProductDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as { product?: ProductProps } | null;
  const productId = Number(id);
  const initialProduct = routeState?.product?.id === productId ? routeState.product : null;

  const [product, setProduct] = useState<ProductProps | null>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setProduct(null);
      setLoading(false);
      setError("Produto inválido.");
      return;
    }

    if (initialProduct) {
      setProduct(initialProduct);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/produtos/${productId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (response.ok) {
          const data: ProductProps = await response.json();
          setProduct(data.ativo ? data : null);
          if (!data.ativo) {
            setError("Este produto não está disponível no momento.");
          }
          return;
        }

        if (response.status === 404) {
          setProduct(null);
          return;
        }

        setError("Não foi possível carregar o produto.");
      } catch (fetchError) {
        console.error("Erro ao carregar detalhes do produto:", fetchError);
        setError("Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [initialProduct, productId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <HomeHeader />
        <main className={styles.mainContent}>
          <div className={styles.feedbackState}>
            <h2>Carregando produto...</h2>
            <p>Buscando os detalhes do item selecionado.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <HomeHeader />
        <div className={styles.notFound}>
          <h2>{error ?? "Produto não encontrado"}</h2>
          <button onClick={() => navigate("/produtos")} className={styles.backBtn}>
            Voltar para produtos
          </button>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const productLink = `${window.location.origin}/produtos/${product.id}`;
    const message = `Olá! Gostaria de fazer o pedido de um ${product.nome}.\n\nLink do produto: ${productLink}`;
    const phone = "5561999767896";
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
            <ProductImage
              imageUrl={product.imagemUrl}
              alt={product.nome}
              className={styles.productImage}
            />
            <span className={styles.categoryBadge}>{product.categoria}</span>
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.productName}>{product.nome}</h1>
            <p className={styles.productDescription}>{product.descricao}</p>

            <div className={styles.includesSection}>
              <h3>Detalhes do produto</h3>
              <ul className={styles.includesList}>
                <li>Categoria: {product.categoria}</li>
                <li>SKU: {product.sku}</li>
                <li>Estoque disponível: {product.quantidadeEstoque} unidades</li>
                <li>Status: {product.ativo ? "Disponível" : "Indisponível"}</li>
              </ul>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.price}>
                R$ {product.preco.toFixed(2).replace(".", ",")}
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
