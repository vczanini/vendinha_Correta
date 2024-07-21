import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CadastrarCliente from './pages/CadastroCliente';
import EditarCliente from './pages/EditarCliente';
import ExcluirCliente from './pages/ExcluirCliente';
import VerificarClientes from './pages/VerificarClientes';
import VerificaDividas from './pages/VerificaDividas';
import CriarDivida from './pages/CriarDivida';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cadastrarcliente" element={<CadastrarCliente />} />
                <Route path="/editarcliente" element={<EditarCliente />} />
                <Route path="/excluircliente" element={<ExcluirCliente />} />
                <Route path="/verificarclientes" element={<VerificarClientes />} />
                <Route path="/verificadividas" element={<VerificaDividas />} />
                <Route path="/criardivida" element={<CriarDivida />} />
            </Routes>
        </Router>
    );
};

export default App;
