import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./productDetailScreen.module.css";
import HomeHeader from "../../home/homeHeader/homeHeader";
import type { ProductProps } from "../../interfaces/productProps";
import ProductImage from "../../components/productImage/productImage";

type CategoriaImagensResponse = {
  categoria: string;
  imagens: string[];
};

type ImagePathInfo = {
  category: string;
  relativePath: string;
  directoryPath: string;
};

const extractImagePathInfo = (imageUrl: string): ImagePathInfo | null => {
  const sanitizedUrl = imageUrl.split("?")[0];
  const match = sanitizedUrl.match(/\/api\/imagens\/(.+)$/);
  if (!match?.[1]) {
    return null;
  }

  const decodedPath = decodeURIComponent(match[1]);
  const pathParts = decodedPath.split("/").filter(Boolean);
  if (pathParts.length < 2) {
    return null;
  }

  const [category, ...remainingParts] = pathParts;
  const relativePath = remainingParts.join("/");
  const directoryPath = remainingParts.length > 1 ? remainingParts.slice(0, -1).join("/") : "";

  return {
    category,
    relativePath,
    directoryPath,
  };
};

const getDirectoryPath = (relativePath: string): string => {
  const parts = relativePath.split("/").filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join("/") : "";
};

const slugifyCategory = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  useEffect(() => {
    if (!product) {
      setGalleryImages([]);
      setCurrentImageIndex(0);
      return;
    }

    const loadGallery = async () => {
      const fallbackImages = product.imagemUrl ? [product.imagemUrl] : [];
      const imageInfo = extractImagePathInfo(product.imagemUrl);

      if (!imageInfo) {
        setGalleryImages(fallbackImages);
        setCurrentImageIndex(0);
        return;
      }

      const productCategory = product.categoria?.trim() ?? "";
      const categoryCandidates = Array.from(
        new Set(
          [
            imageInfo.category,
            productCategory,
            productCategory.toLowerCase(),
            slugifyCategory(productCategory),
          ].filter((value): value is string => Boolean(value))
        )
      );

      if (categoryCandidates.length === 0) {
        setGalleryImages(fallbackImages);
        setCurrentImageIndex(0);
        return;
      }

      try {
        let galleryByPath: string[] = [];

        for (const category of categoryCandidates) {
          const response = await fetch(`/api/imagens/categorias/${encodeURIComponent(category)}`);
          if (!response.ok) {
            continue;
          }

          const data: CategoriaImagensResponse = await response.json();
          const images = Array.isArray(data.imagens) ? data.imagens : [];
          if (images.length === 0) {
            continue;
          }

          const sameDirectoryImages = images.filter(
            (img) => getDirectoryPath(img) === imageInfo.directoryPath
          );

          if (sameDirectoryImages.length > 0) {
            galleryByPath = sameDirectoryImages.map((img) => `/api/imagens/${category}/${img}`);
            break;
          }
        }

        const deduped = Array.from(new Set([product.imagemUrl, ...galleryByPath]));
        setGalleryImages(deduped.length > 0 ? deduped : fallbackImages);
        setCurrentImageIndex(0);
      } catch (galleryError) {
        console.error("Erro ao carregar galeria do produto:", galleryError);
        setGalleryImages(fallbackImages);
        setCurrentImageIndex(0);
      }
    };

    loadGallery();
  }, [product]);

  const currentImage = galleryImages[currentImageIndex] ?? product?.imagemUrl ?? "";

  const handleNextImage = () => {
    if (galleryImages.length < 2) {
      return;
    }
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    if (galleryImages.length < 2) {
      return;
    }
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
  };

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
              imageUrl={currentImage}
              alt={product.nome}
              className={styles.productImage}
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                  aria-label="Imagem anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                  aria-label="Próxima imagem"
                >
                  ›
                </button>
              </>
            )}
            <span className={styles.categoryBadge}>{product.categoria}</span>

            {galleryImages.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`${styles.thumbnailBtn} ${
                      index === currentImageIndex ? styles.thumbnailBtnActive : ""
                    }`}
                    aria-label={`Selecionar imagem ${index + 1}`}
                  >
                    <img src={img} alt={`${product.nome} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
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
