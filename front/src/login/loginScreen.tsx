import { useState } from 'react';
import styles from './loginScreen.module.css';

const LoginScreen = () => {
    const [formData, setFormData] = useState({
        login: '',
        senha: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                // Redirecionar para a tela de gerenciamento
                window.location.href = '/management';
            } else {
                setError('Credenciais inválidas');
            }
        } catch {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1 className={styles.loginTitle}>Bem-vindo à Antonieta Flores</h1>
                <p className={styles.loginSubtitle}>Faça login para acessar o sistema</p>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="login" className={styles.inputLabel}>Email</label>
                        <input
                            type="email"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            className={styles.inputField}
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="senha" className={styles.inputLabel}>Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            className={styles.inputField}
                            placeholder="Sua senha"
                            required
                        />
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className={styles.registerLink}>
                    Não tem conta? <a href="/register">Registrar-se</a>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;