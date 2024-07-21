import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VerificarClientes.css';

const VerificarClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalDebts, setTotalDebts] = useState(0);
    const clientsPerPage = 10;

    const fetchClientes = async (page) => {
        try {
            const response = await fetch('https://localhost:7268/api/Cliente/buscarclientes');
            const result = await response.json();

            // Pagination logic
            const startIndex = (page - 1) * clientsPerPage;
            const endIndex = startIndex + clientsPerPage;
            const paginatedClientes = result.slice(startIndex, endIndex);

            // Calculate total debts
            const total = result.reduce((sum, cliente) => sum + cliente.totalDividas, 0);
            setTotalDebts(total);

            setClientes(paginatedClientes);
            setTotalPages(Math.ceil(result.length / clientsPerPage));
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    };

    const searchClientes = async () => {
        try {
            const response = await fetch('https://localhost:7268/api/Cliente/buscarclientenome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nomeCompleto: searchQuery }),
            });
            const result = await response.json();

            // Check if the response is valid
            if (Array.isArray(result) && result.length > 0) {
                setClientes(result);
                setTotalDebts(result.reduce((sum, cliente) => sum + cliente.totalDividas, 0));
                setTotalPages(1);
            } else {
                setClientes([]);
                setTotalDebts(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error searching clientes:', error);
        }
    };

    useEffect(() => {
        if (!searchQuery) {
            fetchClientes(currentPage);
        }
    }, [currentPage, searchQuery]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container">
            <h1>Verificar Clientes</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Pesquisar Nome"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={searchClientes}>Pesquisar</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome Completo</th>
                        <th>CPF</th>
                        <th>Idade</th>
                        <th>Email</th>
                        <th>Total Dívidas</th>
                        <th>Verifica Dívidas</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.clientId}>
                            <td>{cliente.clientId}</td>
                            <td>{cliente.nomeCompleto}</td>
                            <td>{cliente.cpf}</td>
                            <td>{cliente.idade}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.totalDividas.toFixed(2)}</td>
                            <td>
                                <Link
                                    to={`/verifica-dividas?clientId=${cliente.clientId}&nomeCompleto=${encodeURIComponent(cliente.nomeCompleto)}&totalDividas=${cliente.totalDividas.toFixed(2)}`}
                                >
                                    <button>Verifica Dívidas</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && !searchQuery && (
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span> Página {currentPage} de {totalPages} </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Próxima
                    </button>
                </div>
            )}
            <br />
            <div className="footer">
                <span>Total Dívidas: R$ {totalDebts.toFixed(2)}</span>
                <Link to="/">
                    <button className="link-button">Home Page</button>
                </Link>
            </div>
        </div>
    );
};

export default VerificarClientes;
