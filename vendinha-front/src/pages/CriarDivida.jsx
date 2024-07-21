import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CriarDivida.css';

const CriarDivida = () => {
    const [clientId, setClientId] = useState(null);
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const clientId = params.get('clientId');

        if (clientId) {
            setClientId(clientId);
        }
    }, [location.search]);

    const handleCriarDivida = async () => {
        if (!valor || !descricao) {
            setError('Valor e descrição são obrigatórios.');
            return;
        }

        const valorNumber = parseFloat(valor);
        if (isNaN(valorNumber) || valorNumber <= 0) {
            setError('Valor deve ser um número positivo.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7268/api/Divida/criardivida', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId,
                    valor: valorNumber,
                    descricao
                }),
            });

            const result = await response.json();

            if (result.erro === 0) {
                setSuccessMessage('Dívida criada com sucesso!');
                setError('');
            } else if (result.erro === 5) {
                setError('CPF não está no sistema.');
                setSuccessMessage('');
            } else if (result.erro === 6) {
                setError('Dívida ultrapassa o limite de 200 reais.');
                setSuccessMessage('');
            } else {
                setError('Erro desconhecido.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error creating divida:', error);
            setError('Erro ao criar dívida. Tente novamente mais tarde.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <h1>Criar Dívida</h1>
            <div className="form-group">
                <label>Client ID:</label>
                <input
                    type="text"
                    value={clientId || ''}
                    readOnly
                    className="input-readonly"
                />
            </div>
            <div className="form-group">
                <label>Valor:</label>
                <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="input"
                />
            </div>
            <div className="form-group">
                <label>Descrição:</label>
                <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="input"
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <button onClick={handleCriarDivida} className="btn-submit">Criar Dívida</button>
            <br />
            <button onClick={() => navigate('/verificarclientes')} className="btn-link">Voltar à Página de Clientes</button>
        </div>
    );
};

export default CriarDivida;
