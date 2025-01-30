import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/header/header';
import Login from './pages/login';
import Home from './pages/home';
import About from './pages/about';
import NotFound from './pages/notfound';
import ProtectedRoute from './components/protected-route';
import Contact from './pages/contact';
import Imovel from './pages/imovel';
import Imoveis from './pages/imoveis';
import Usuarios from './pages/usuarios';
import Usuario from './pages/usuario';
import CadastroUsuario from './pages/cadastro-usuario';
import CadastroImovel from './pages/cadastro-imovel';
import CadastroCategoria from './pages/cadastro-categoria';
import Footer from './components/footer';

function App() {   
        
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="login" element={<Login />} />
                    <Route path="/usuarios" element={<ProtectedRoute element={Usuarios} />} />
                    <Route path="/usuarios/*" element={<ProtectedRoute element={Usuarios} />} />
                    <Route path="usuarios/:id" element={<ProtectedRoute element={Usuario} />} />
                    <Route path="imoveis" element={<Imoveis />} />                    
                    <Route path="imoveis/:codigo" element={<Imovel />} />
                    <Route path="cadastro-usuario" element={<CadastroUsuario />} />
                    <Route path="cadastro-imovel" element={<CadastroImovel />} />
                    <Route path="cadastro-categoria" element={<CadastroCategoria />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />                    
                    <Route path="*" element={<NotFound />} />                    
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;