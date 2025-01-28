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
                    <li><NavLink to="imoveis/imovel-1">Imovel 1</NavLink></li>
                    <li><NavLink to="imoveis/imovel-2">Imovel 2</NavLink></li>
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