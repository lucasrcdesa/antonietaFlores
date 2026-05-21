import { useEffect, useState } from "react";
import HomeHeader from "../home/homeHeader/homeHeader";
import styles from "./tabelaPrecos.module.css";
import type { ProductProps } from "../interfaces/productProps";

const formatPrice = (price: number): string => {
  if (price <= 0) return "A consultar";
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
};

const TabelaPrecos = () => {
  const [grouped, setGrouped] = useState<Record<string, ProductProps[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((data: ProductProps[]) => {
        const active = data.filter((p) => p.ativo);
        const sorted = [...active].sort((a, b) =>
          a.categoria.localeCompare(b.categoria) || a.nome.localeCompare(b.nome)
        );
        const map: Record<string, ProductProps[]> = {};
        for (const product of sorted) {
          if (!map[product.categoria]) map[product.categoria] = [];
          map[product.categoria].push(product);
        }
        setGrouped(map);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.pageContainer}>
      <HomeHeader />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Tabela de Preços</h1>
            <p className={styles.subtitle}>Flores e arranjos para cada ocasião especial</p>
          </div>

          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className={styles.empty}>Nenhum produto disponível no momento.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thName}>Produto</th>
                  <th className={styles.thPrice}>Preço</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([category, products]) => (
                  <>
                    <tr key={`cat-${category}`} className={styles.categoryRow}>
                      <td colSpan={2} className={styles.categoryCell}>{category}</td>
                    </tr>
                    {products.map((product, idx) => (
                      <tr
                        key={product.id}
                        className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}
                      >
                        <td className={styles.tdName}>{product.nome}</td>
                        <td className={styles.tdPrice}>{formatPrice(product.preco)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          )}

          <p className={styles.footer}>
            * Preços sujeitos a alteração sem aviso prévio. Entre em contato para mais informações.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TabelaPrecos;
