import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="container">
            <h1>Maximus Vendinha</h1>
            <h2>Sistema de dívidas</h2>
            <div className="link-container">
                <Link to="/cadastrarcliente">
                    <button>Cadastrar Cliente</button>
                </Link>
                <Link to="/editarcliente">
                    <button>Editar Cliente</button>
                </Link>
                <Link to="/excluircliente">
                    <button>Excluir Cliente</button>
                </Link>
                <Link to="/verificarclientes">
                    <button>Verificar Clientes</button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
