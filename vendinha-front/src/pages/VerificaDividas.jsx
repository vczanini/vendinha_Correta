import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerificaDividas.css';

const VerificaDividas = () => {
    const [dividas, setDividas] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [totalDividas, setTotalDividas] = useState(0);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const clientId = params.get('clientId');
        const nomeCompleto = params.get('nomeCompleto');
        const totalDividas = params.get('totalDividas');

        if (clientId && nomeCompleto) {
            setClientId(clientId);
            setNomeCompleto(nomeCompleto);
            setTotalDividas(parseFloat(totalDividas) || 0);
            fetchDividas(clientId);
        }
    }, [location.search]);

    const fetchDividas = async (clientId) => {
        try {
            const response = await fetch('https://localhost:7268/api/Divida/buscardividas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'client_id': clientId }),
            });
            const result = await response.json();

            if (Array.isArray(result)) {
                const formattedDividas = result.map(divida => ({
                    ...divida,
                    descricao: divida.descricao.replace(/\\/g, ''),
                }));
                setDividas(formattedDividas);
                setError('');
            } else {
                setDividas([]);
                setError('Nenhuma dívida encontrada para este cliente.');
            }
        } catch (error) {
            console.error('Error fetching dividas:', error);
            setError('Erro ao buscar dívidas. Tente novamente mais tarde.');
        }
    };

    const handlePagarDividas = async () => {
        const selectedDividas = dividas
            .filter(divida => divida.selected)
            .map(divida => divida.dividaId);

        if (selectedDividas.length === 0) {
            setError('Nenhuma dívida selecionada.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7268/api/Divida/pagardividas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ divida_ids: selectedDividas }),
            });

            const result = await response.json();

            if (result.erro === 0) {
                setSuccessMessage('Dívidas pagas com sucesso!');
                setError('');
                fetchDividas(clientId);
            } else {
                setError('Erro ao pagar dívidas.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error paying dividas:', error);
            setError('Erro ao pagar dívidas. Tente novamente mais tarde.');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <h1>Verifica Dívidas</h1>
            <div>
                <h2>Cliente: {nomeCompleto} (ID: {clientId})</h2>
                <p>Total de Dívidas: R$ {totalDividas.toFixed(2)}</p> { }
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                <button onClick={() => navigate(`/criardivida?clientId=${clientId}`)}>
                    Adicionar Dívidas
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Data de Criação</th>
                            <th>Selecionar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dividas.map(divida => (
                            <tr key={divida.dividaId}>
                                <td>{divida.dividaId}</td>
                                <td>{divida.descricao}</td>
                                <td>{divida.valor.toFixed(2)}</td>
                                <td>{new Date(divida.dataCriacao).toLocaleDateString()}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={divida.selected || false}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setDividas(dividas.map(d =>
                                                d.dividaId === divida.dividaId ? { ...d, selected: isChecked } : d
                                            ));
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <button onClick={handlePagarDividas}>Pagar Dívidas</button>
                <button onClick={() => navigate('/verificarclientes')}>Voltar à Página de Clientes</button>
            </div>
        </div>
    );
};

export default VerificaDividas;
