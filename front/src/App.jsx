import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/header/header';
import Login from './pages/login';
import Home from './pages/home';
import About from './pages/about';
import NotFound from './pages/notfound';
import ProtectedRoute from './components/ProtectedRoute';
import Contact from './pages/contact';
import Imovel from './pages/imovel';
import Cadastro from './pages/cadastro';
import Footer from './components/footer';
import CadastroImovel from './pages/cadastroimovel';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute element={Home} />} />
                    <Route path="imoveis/:id" element={<Imovel />} />
                    <Route path="cadastro" element={<Cadastro />} />
                    <Route path="cadastro-imovel" element={<CadastroImovel />} />
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