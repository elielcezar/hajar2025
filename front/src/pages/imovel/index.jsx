import { useEffect, useState } from 'react';  
import { useParams } from 'react-router-dom';
import api from '../../services/api'
import './style.css'

function Imovel() {  

  const params = useParams(); 

  const [user, setUser] = useState('');

  async function getUser() { 
    try{
      const user = await api.get(`/usuarios/${params.id}`);
      setUser(user.data); 
      console.log(user.data)
    }catch{
      console.error('Erro ao buscar usuário:', error);
    }        
  }   

  useEffect(() => {  
    getUser();
  }, []);

  const baseUrl = 'http://localhost:3000/uploads/'; 

  /*console.log('ID do imóvel:', params.id);
  console.log('User:', usuario);*/

  return (
    <>
      <h1>{params.id}</h1>      

      <h1>Detalhes do Usuário</h1>
      <p>ID: {user.id}</p>
      <p>ID: {user.name}</p>
      <p>ID: {user.email}</p>
      <ul>
        {Array.isArray(user.photos) && user.photos.map((photo, index) => (
          <li key={index}>
            <img src={`${baseUrl}${photo}`} alt={`Foto ${index + 1}`} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default Imovel