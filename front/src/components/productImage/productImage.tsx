import React from 'react';
import { useDynamicImage } from '../../hooks/useDynamicImage';
import styles from './productImage.module.css';

interface ProductImageProps {
  imageUrl: string;
  alt: string;
  className?: string;
  fallbackImage?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  alt,
  className = '',
  fallbackImage = '/placeholder-product.svg'
}) => {
  const { src, loaded, error } = useDynamicImage(imageUrl, fallbackImage);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {!loaded && (
        <div className={styles.imagePlaceholder}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${styles.productImage} ${loaded ? styles.loaded : styles.loading}`}
        style={{ display: loaded ? 'block' : 'none' }}
      />
      {error && loaded && (
        <div className={styles.errorOverlay}>
          <span className={styles.errorText}>Imagem não encontrada</span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;