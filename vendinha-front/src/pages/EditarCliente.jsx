import { useState } from 'react';
import { Link } from 'react-router-dom';
import './EditarCliente.css';

const EditarCliente = () => {
    const [cpf, setCpf] = useState('');
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isClienteFound, setIsClienteFound] = useState(false);

    const handleFindClient = async () => {
        if (!cpf) {
            setError('CPF é obrigatório.');
            return;
        }

        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('https://localhost:7268/api/Cliente/buscarclientecpf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ CPF: cpf })
            });

            const result = await response.json();

            if (result.erro === 0) {
                setNomeCompleto(result.nomeCompleto);
                setDataNascimento(result.dataNascimento);
                setEmail(result.email);
                setIsClienteFound(true);
                setError('');
            } else if (result.erro === 5) {
                setError('CPF não cadastrado no sistema.');
                setSuccessMessage('');
                setIsClienteFound(false);
            } else {
                setError('Erro desconhecido.');
                setSuccessMessage('');
                setIsClienteFound(false);
            }
        } catch (error) {
            console.error('Error finding client:', error);
            setError('Erro ao buscar cliente. Tente novamente mais tarde.');
            setSuccessMessage('');
            setIsClienteFound(false);
        }
    };

    const handleUpdate = async () => {
        if (!cpf || !dataNascimento) {
            setError('CPF e Data de Nascimento são obrigatórios.');
            return;
        }

        setError('');

        const data = {
            nomeCompleto,
            cpf,
            dataNascimento,
            email
        };

        try {
            const response = await fetch('https://localhost:7268/api/Cliente/editarcliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.erro === 0) {
                setSuccessMessage('Cliente atualizado com sucesso!');
                setError('');
            } else if (result.erro === 1) {
                setError('CPF já cadastrado.');
                setSuccessMessage('');
            } else if (result.erro === 2) {
                setError('Email já cadastrado.');
                setSuccessMessage('');
            } else if (result.erro === 3) {
                setError('CPF inválido.');
                setSuccessMessage('');
            } else {
                setError('Erro desconhecido.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error during client update:', error);
            setError('Erro ao atualizar cliente. Tente novamente mais tarde.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <h1>Editar Cliente</h1>
            <form>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={isClienteFound}
                    />
                    <button type="button" onClick={handleFindClient}>Encontrar Cliente</button>
                </div>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                {isClienteFound && (
                    <>
                        <div>
                            <label>Nome Completo:</label>
                            <input
                                type="text"
                                value={nomeCompleto}
                                onChange={(e) => setNomeCompleto(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Data de Nascimento:</label>
                            <input
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="button-container">
                            <button type="button" onClick={handleUpdate}>Atualizar</button>
                        </div>
                    </>
                )}
                <div className="button-container">
                    <Link to="/">
                        <button>Home Page</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditarCliente;
