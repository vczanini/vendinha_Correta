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
            setError('Valor e descri��o s�o obrigat�rios.');
            return;
        }

        const valorNumber = parseFloat(valor);
        if (isNaN(valorNumber) || valorNumber <= 0) {
            setError('Valor deve ser um n�mero positivo.');
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
                setSuccessMessage('D�vida criada com sucesso!');
                setError('');
            } else if (result.erro === 5) {
                setError('CPF n�o est� no sistema.');
                setSuccessMessage('');
            } else if (result.erro === 6) {
                setError('D�vida ultrapassa o limite de 200 reais.');
                setSuccessMessage('');
            } else {
                setError('Erro desconhecido.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error creating divida:', error);
            setError('Erro ao criar d�vida. Tente novamente mais tarde.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <h1>Criar D�vida</h1>
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
                <label>Descri��o:</label>
                <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="input"
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <button onClick={handleCriarDivida} className="btn-submit">Criar D�vida</button>
            <br />
            <button onClick={() => navigate('/verificarclientes')} className="btn-link">Voltar � P�gina de Clientes</button>
        </div>
    );
};

export default CriarDivida;
