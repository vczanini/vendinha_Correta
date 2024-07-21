import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CadastrarCliente.css';

const CadastrarCliente = () => {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCadastro = async () => {
        // Validation logic
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
            const response = await fetch('https://localhost:7268/api/Cliente/CriarCliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.erro === 0) {
                setSuccessMessage('Cadastro realizado com sucesso!');
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
            console.error('Error during client registration:', error);
            setError('Erro ao cadastrar cliente. Tente novamente mais tarde.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <h1>Cadastro de Cliente</h1>
            <form>
                <div>
                    <label>Nome Completo:</label>
                    <input
                        type="text"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                    />
                </div>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
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
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="button-container">
                    <button type="button" onClick={handleCadastro}>Cadastrar</button>
                    <div className="link-container">
                        <Link to="/">
                            <button>Go to Home Page</button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CadastrarCliente;
