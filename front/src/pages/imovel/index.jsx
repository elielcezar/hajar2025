import { useEffect, useState } from 'react';  
import { useParams } from 'react-router-dom';
import api from '../../services/api'
import './style.css'

function Imovel() {  

  const params = useParams(); 

  const [imovel, setImovel] = useState('');

  async function getImovel() { 
    try{
      const imovelFromApi = await api.get(`/imoveis/${params.codigo}`);
      setImovel(imovelFromApi.data[0]);       
    }catch{
      console.error('Erro ao buscar imóvel:', error);
    }        
  }  

  useEffect(() => {  
    getImovel();
  }, []);

  const baseUrl = 'http://localhost:3000/uploads/'; 

  return (
    <div id="main">
      <h1>{params.codigo}</h1>      

      <h1>Detalhes do imóvel</h1>
      <p>Código: {imovel.codigo}</p>
      <p>Nome: {imovel.titulo}</p>
      <p>Descrição: {imovel.descricaoLonga}</p>
      <ul>
        {Array.isArray(imovel.fotos) && imovel.fotos.map((foto, index) => (
          <li key={index}>
            <img src={`${baseUrl}${foto}`} alt={`Foto ${index + 1}`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Imovel