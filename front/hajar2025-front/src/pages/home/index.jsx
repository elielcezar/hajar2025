import { useEffect, useState, useRef } from 'react';
import bcrypt from 'bcryptjs';
import './style.css'
import api from '../../services/api'

function Home() { 

    const [users, setUsers] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    async function getUsers() { 
        const usersFromApi = await api.get('/usuarios');
        setUsers(usersFromApi.data.reverse());          
    }

    useEffect(() => {  
        getUsers();
    }, []);

    const inputName = useRef();    
    const inputEmail = useRef();
    const inputPassword = useRef();

    async function createUser() {
        
        const passwordValue = inputPassword.current.value;
        const hashedPassword = await bcrypt.hash(passwordValue, 10); // Encripta a senha        

        await api.post('/usuarios', {
            name: inputName.current.value,            
            email: inputEmail.current.value,
            password: hashedPassword
        })           
        getUsers();
        
        inputName.current.value = '';        
        inputEmail.current.value = '';
        inputPassword.current.value = '';
        
        setConfirmationMessage('Usuário cadastrado com sucesso!');        
        setTimeout(() => setConfirmationMessage(''), 5000);
    }

    async function deleteUser(id) {         
        await api.delete(`/usuarios/${id}`);  
        getUsers();      
    }
   
  return (
    <>
      <div className="container">        
        {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

        <form>
            <div className="form-item">
                <input type="text" name="name" className="name" placeholder='Nome' ref={inputName} />
            </div>           
            <div className="form-item">
                <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} />
            </div>
            <div className="form-item">
                <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} />
            </div>
            <div className="form-item">
                <button type='button' onClick={createUser}>- Enviar -</button>
            </div>
        </form>

        <div className='listaUsuarios'>
            {users.map((user) => (                
                <div className="item" key={user.id}>
                    <p>Nome: {user.name}</p>
                    <p>Idade: {user.age}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={() => deleteUser(user.id)}>Excluir</button>
                </div>                
            ))}
        </div>
        
      </div>      
    </>
  )
}

export default Home