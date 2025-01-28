import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api'
import './style.css'

function Login() { 
    
    const [confirmationMessage, setConfirmationMessage] = useState('');    
    const inputEmail = useRef();
    const inputPassword = useRef();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    async function handleLogin(){

        const email = inputEmail.current.value;
        const password = inputPassword.current.value;
        
        try {
            const response = await api.post('/login', { email, password });            
            const { token } = response.data;
            login(token);

            setConfirmationMessage('Login efetuado com sucesso!');            
            
            // Redireciona para a página inicial
            navigate('/');
        } catch (error) {
            console.error(error);
            setConfirmationMessage('Erro ao efetuar login.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }
   
  return (
    <>
      <div className="container">        
        {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

        <form>           
            <div className="form-item">
                <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} />
            </div>
            <div className="form-item">
                <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} />
            </div>
            <div className="form-item">
                <button type='button' onClick={handleLogin}>- Enviar -</button>
            </div>
        </form>        
        
      </div>      
    </>
  )
}

export default Login