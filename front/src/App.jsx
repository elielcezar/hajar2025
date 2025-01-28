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
import Footer from './components/footer';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute element={Home} />} />
                    <Route path="imoveis/:id" element={<Imovel />} />
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