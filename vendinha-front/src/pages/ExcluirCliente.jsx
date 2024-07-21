import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExcluirCliente.css';

const ExcluirCliente = () => {
    const [cpf, setCpf] = useState('');
    const [clientInfo, setClientInfo] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleFindClient = async () => {
        setError('');
        setSuccessMessage('');

        if (!cpf) {
            setError('CPF é obrigatório.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7268/api/Cliente/buscarclientecpf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ CPF: cpf }),
            });

            const result = await response.json();

            if (result.erro === 0) {
                setClientInfo(result);
            } else if (result.erro === 5) {
                setError('CPF não cadastrado no sistema.');
                setClientInfo(null);
            }
        } catch (error) {
            console.error('Error finding client:', error);
            setError('Erro ao buscar cliente. Tente novamente mais tarde.');
            setClientInfo(null);
        }
    };

    const handleDeactivateClient = async () => {
        setError('');
        setSuccessMessage('');

        if (!cpf) {
            setError('CPF é obrigatório.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7268/api/Cliente/deletarcliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ CPF: cpf }),
            });

            const result = await response.json();

            if (result.erro === 0) {
                setSuccessMessage('Cliente inativado com sucesso.');
                setClientInfo(null);
                setCpf('');
            } else if (result.erro === 5) {
                setError('CPF não encontrado.');
            } else if (result.erro === 6) {
                setError('Cliente ainda com dívidas.');
            }
        } catch (error) {
            console.error('Error deactivating client:', error);
            setError('Erro ao inativar cliente. Tente novamente mais tarde.');
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <h1>Excluir Cliente</h1>
            <form>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={!!clientInfo}
                    />
                </div>
                <button type="button" onClick={handleFindClient} disabled={!!clientInfo}>
                    Encontrar Cliente
                </button>
                {clientInfo && (
                    <div className="client-info">
                        <h2>Informações do Cliente</h2>
                        <p><strong>Nome Completo:</strong> {clientInfo.nomeCompleto}</p>
                        <p><strong>Data de Nascimento:</strong> {clientInfo.dataNascimento}</p>
                        <p><strong>Email:</strong> {clientInfo.email}</p>
                        <button type="button" onClick={handleDeactivateClient}>Inativar Cliente</button>
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="button-container">
                    <button type="button" onClick={handleBackToHome}>Home Page</button>
                </div>
            </form>
        </div>
    );
};

export default ExcluirCliente;
