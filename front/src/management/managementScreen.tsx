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
    const [sortField, setSortField] = useState<keyof Produto | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [imageCategorias, setImageCategorias] = useState<string[]>([]);
    const [selectedImageCategoria, setSelectedImageCategoria] = useState<string | null>(null);
    const [imagensDisponiveis, setImagensDisponiveis] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [imagePickerError, setImagePickerError] = useState<string | null>(null);
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
            if (!token) {
                navigate('/login');
                return;
            }

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

    const carregarCategorias = async () => {
        try {
            setImagePickerError(null);
            const response = await fetch('/api/imagens/categorias');
            if (response.ok) {
                const data = await response.json();
                setImageCategorias(data.categorias || []);
            } else {
                setImagePickerError('Nao foi possivel carregar as categorias de imagem.');
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setImagePickerError('Nao foi possivel carregar as categorias de imagem.');
        }
    };

    const carregarImagensDaCategoria = async (categoria: string) => {
        setLoadingImages(true);
        try {
            setImagePickerError(null);
            const response = await fetch(`/api/imagens/categorias/${categoria}`);
            if (response.ok) {
                const data = await response.json();
                setImagensDisponiveis(data.imagens || []);
            } else {
                setImagePickerError('Nao foi possivel carregar as imagens da categoria.');
            }
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            setImagePickerError('Nao foi possivel carregar as imagens da categoria.');
        } finally {
            setLoadingImages(false);
        }
    };

    const abrirImagePicker = async () => {
        setShowImagePicker(true);
        if (imageCategorias.length === 0) {
            await carregarCategorias();
        }
    };

    const selecionarImagem = (nomeImagem: string) => {
        if (selectedImageCategoria) {
            const caminhoImagem = `/api/imagens/${selectedImageCategoria}/${nomeImagem}`;
            setFormData({ ...formData, imagemUrl: caminhoImagem });
            setShowImagePicker(false);
            setSelectedImageCategoria(null);
            setImagensDisponiveis([]);
        }
    };

    const fecharImagePicker = () => {
        setShowImagePicker(false);
        setSelectedImageCategoria(null);
        setImagensDisponiveis([]);
        setImagePickerError(null);
    };

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
        if (!token) {
            navigate('/login');
            return;
        }

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
                return;
            }

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
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
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadProdutos();
                return;
            }

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
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

    const handleSort = (field: keyof Produto) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedProdutos = sortField
        ? [...produtos].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sortDirection === 'asc' ? cmp : -cmp;
        })
        : produtos;

    const sortIcon = (field: keyof Produto) => {
        if (sortField !== field) return <span className={styles.sortIndicator}>↕</span>;
        return <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
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
                                <th className={styles.thSortable} onClick={() => handleSort('id')}>ID {sortIcon('id')}</th>
                                <th className={styles.thSortable} onClick={() => handleSort('sku')}>SKU {sortIcon('sku')}</th>
                                <th className={styles.thSortable} onClick={() => handleSort('nome')}>Nome {sortIcon('nome')}</th>
                                <th className={styles.thSortable} onClick={() => handleSort('categoria')}>Categoria {sortIcon('categoria')}</th>
                                <th className={styles.thSortable} onClick={() => handleSort('preco')}>Preço {sortIcon('preco')}</th>
                                <th className={styles.thSortable} onClick={() => handleSort('quantidadeEstoque')}>Estoque {sortIcon('quantidadeEstoque')}</th>
                                <th className={styles.thSortable} onClick={() => handleSort('ativo')}>Status {sortIcon('ativo')}</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProdutos.map(produto => (
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
                                <div className={styles.imageUrlRow}>
                                    <input
                                        type="text"
                                        value={formData.imagemUrl}
                                        onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                                    />
                                    <button
                                        type="button"
                                        onClick={abrirImagePicker}
                                        className={styles.pickImageBtn}
                                    >
                                        🔍 Selecionar foto
                                    </button>
                                </div>
                                <p className={styles.imageHelperText}>Use o botao ao lado para escolher a imagem com preview.</p>

                                {formData.imagemUrl && (
                                    <div className={styles.currentImagePreview}>
                                        <img src={formData.imagemUrl} alt="Preview da imagem selecionada" />
                                    </div>
                                )}
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

            {showImagePicker && (
                <div className={styles.modal}>
                    <div className={styles.modalContent} style={{ maxWidth: '900px' }}>
                        <h2>Selecionar Imagem</h2>

                        {!selectedImageCategoria ? (
                            <div>
                                <p>Selecione uma categoria:</p>
                                {imagePickerError && <p>{imagePickerError}</p>}
                                {!imagePickerError && imageCategorias.length === 0 && <p>Nenhuma categoria encontrada.</p>}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {imageCategorias.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedImageCategoria(cat);
                                                carregarImagensDaCategoria(cat);
                                            }}
                                            style={{
                                                padding: '1rem',
                                                background: '#F7F2ED',
                                                border: '2px solid #7A8E7A',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: '#6E5A4E',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={() => {
                                        setSelectedImageCategoria(null);
                                        setImagensDisponiveis([]);
                                    }}
                                    style={{
                                        marginBottom: '1rem',
                                        padding: '0.5rem 1rem',
                                        background: '#A78F7E',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ← Voltar às categorias
                                </button>

                                {loadingImages ? (
                                    <p>Carregando imagens...</p>
                                ) : (
                                    <>
                                    {imagePickerError && <p>{imagePickerError}</p>}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        {imagensDisponiveis.length === 0 ? (
                                            <p>Nenhuma imagem encontrada nesta categoria.</p>
                                        ) : (
                                            imagensDisponiveis.map((img) => (
                                                <div
                                                    key={img}
                                                    onClick={() => selecionarImagem(img)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        border: '2px solid #ddd',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        transition: 'transform 0.2s',
                                                        textAlign: 'center'
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                                >
                                                    <img
                                                        src={`/api/imagens/${selectedImageCategoria}/${img}`}
                                                        alt={img}
                                                        style={{
                                                            width: '100%',
                                                            height: '120px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <p style={{
                                                        margin: '0.5rem 0',
                                                        fontSize: '0.8rem',
                                                        color: '#6E5A4E',
                                                        padding: '0.3rem'
                                                    }}>
                                                        {img}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                onClick={fecharImagePicker}
                                className={styles.cancelBtn}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementScreen;
