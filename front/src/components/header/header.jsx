import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './style.css';



function Header() {

    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();  

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">
                <NavLink to="/" end>MeuProjeto</NavLink>
            </div>
            <nav className="nav">
                <ul>
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="about">Sobre</NavLink></li>
                    <li><NavLink to="imoveis/6798e97c5baa134c63f88f93">Imovel 1</NavLink></li>
                    {isAuthenticated ? (
                        <li><NavLink to="cadastro-imovel">Novo Imóvel</NavLink></li>                        
                    ) : null}
                    {isAuthenticated ? (                        
                        <li><NavLink to="cadastro">Novo Usuário</NavLink></li>
                    ) : null}
                    <li><NavLink to="contact">Contato</NavLink></li>                    
                </ul>
            </nav>

            {isAuthenticated ? (
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            ) : null}
            
        </header>
    );
}

export default Header;