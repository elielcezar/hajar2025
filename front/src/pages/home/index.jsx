import { useEffect, useState, useRef } from 'react';
import './style.css'
import api from '../../services/api'

function Home() { 

    const [users, setUsers] = useState([]);
    
    async function getUsers() { 
        const usersFromApi = await api.get('/usuarios');
        setUsers(usersFromApi.data.reverse());          
    }

    useEffect(() => {  
        getUsers();
    }, []);    

    async function deleteUser(id) {         
        await api.delete(`/usuarios/${id}`);  
        getUsers();      
    }

    const baseUrl = '/imoveis/'; 
   
  return (
    <>
      <div className="container">  

        <div className='listaUsuarios'>
            {users.map((user) => (                
                <div className="item" key={user.id}>
                    <p><a href={`${baseUrl}${user.id}`}>{user.name}</a></p>
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