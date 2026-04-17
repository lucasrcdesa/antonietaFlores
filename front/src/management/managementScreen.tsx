import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './managementScreen.module.css';

interface Produto {
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
}

const ManagementScreen = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [formData, setFormData] = useState<Produto>({
        sku: '',
        nome: '',
        descricao: '',
        preco: 0,
        quantidadeEstoque: 0,
        ativo: true,
        categoria: '',
        imagemUrl: ''
    });
    const navigate = useNavigate();

    const loadProdutos = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/produtos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProdutos(data);
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        loadProdutos();
    }, [navigate, loadProdutos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const url = editingProduto
                ? `/api/produtos/${editingProduto.id}`
                : '/api/produtos';

            const method = editingProduto ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingProduto(null);
                resetForm();
                loadProdutos();
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
        }
    };

    const handleEdit = (produto: Produto) => {
        setEditingProduto(produto);
        setFormData(produto);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadProdutos();
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const resetForm = () => {
        setFormData({
            sku: '',
            nome: '',
            descricao: '',
            preco: 0,
            quantidadeEstoque: 0,
            ativo: true,
            categoria: '',
            imagemUrl: ''
        });
    };

    const openModal = () => {
        setEditingProduto(null);
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Carregando produtos...</p>
            </div>
        );
    }

    return (
        <div className={styles.managementContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>Central de Gerenciamento</h1>
                <div className={styles.headerActions}>
                    <button onClick={openModal} className={styles.addBtn}>
                        ➕ Novo Produto
                    </button>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Sair
                    </button>
                </div>
            </header>

            <div className={styles.content}>
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <h3>Total de Produtos</h3>
                        <p className={styles.statNumber}>{produtos.length}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Produtos Ativos</h3>
                        <p className={styles.statNumber}>
                            {produtos.filter(p => p.ativo).length}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Estoque Total</h3>
                        <p className={styles.statNumber}>
                            {produtos.reduce((sum, p) => sum + p.quantidadeEstoque, 0)}
                        </p>
                    </div>
                </div>

                <div className={styles.productsTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>SKU</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(produto => (
                                <tr key={produto.id}>
                                    <td>{produto.id}</td>
                                    <td>{produto.sku}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.categoria}</td>
                                    <td>R$ {produto.preco.toFixed(2)}</td>
                                    <td>{produto.quantidadeEstoque}</td>
                                    <td>
                                        <span className={produto.ativo ? styles.active : styles.inactive}>
                                            {produto.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(produto)}
                                            className={styles.editBtn}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(produto.id!)}
                                            className={styles.deleteBtn}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{editingProduto ? 'Editar Produto' : 'Novo Produto'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>SKU</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nome</label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descrição</label>
                                <textarea
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Preço</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.preco}
                                        onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Estoque</label>
                                    <input
                                        type="number"
                                        value={formData.quantidadeEstoque}
                                        onChange={(e) => setFormData({...formData, quantidadeEstoque: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Categoria</label>
                                    <input
                                        type="text"
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Status</label>
                                    <select
                                        value={formData.ativo.toString()}
                                        onChange={(e) => setFormData({...formData, ativo: e.target.value === 'true'})}
                                    >
                                        <option value="true">Ativo</option>
                                        <option value="false">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>URL da Imagem</label>
                                <input
                                    type="text"
                                    value={formData.imagemUrl}
                                    onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    {editingProduto ? 'Atualizar' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementScreen;