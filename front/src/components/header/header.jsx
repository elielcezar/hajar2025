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
                    <li><NavLink to="imoveis">Imoveis</NavLink></li>                    
                    {isAuthenticated ? (
                        <>
                        <li><NavLink to="usuarios">Usuários</NavLink></li>
                        <li><NavLink to="cadastro-imovel">Novo Imóvel</NavLink></li>                        
                        <li><NavLink to="cadastro">Novo Usuário</NavLink></li>
                        </>
                    ) : null}                    
                    <li><NavLink to="contact">Contato</NavLink></li>
                    <li><NavLink to="login">Login</NavLink></li> 
                </ul>
            </nav>

            {isAuthenticated ? (
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            ) : null}
            
        </header>
    );
}

export default Header;