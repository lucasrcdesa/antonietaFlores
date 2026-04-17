export type ProductProps = {
  id?: number;
  sku: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  ativo: boolean;
  categoria: string;
  imagemUrl: string;
  createdAt?: string;
  updatedAt?: string;
};