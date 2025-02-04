import { useEffect, useState } from 'react';  
import { useParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import api from '@/services/api'
import './style.css'

function Imovel() {  

  const params = useParams(); 
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [imovelData, setImovelData] = useState({ fotos: [] });
  const baseUrl = 'http://localhost:3000/uploads/'; 

  async function getImovelData() { 
    try{
      const imovelFromApi = await api.get(`/imoveis/${params.codigo}`);
      setImovelData(imovelFromApi.data[0]);     
      console.log('API Response:', imovelFromApi.data); // Debug full response  
    }catch{
      console.error('Erro ao buscar imóvel:', error);
    }        
  }  

  useEffect(() => {  
    getImovelData();
  }, []);

  useEffect(() => {  
    /*console.log('Full imovelData:', imovelData); // Debug full state object
  console.log('Finalidade:', imovelData?.finalidade);
  console.log('Tipo:', imovelData?.tipo);*/
  }, [imovelData]);

  return (
    <div id="main">
      
      <div className="page-title">
        <h1>{imovelData?.titulo}</h1>
      </div>
      <div className="container">    
        <div className="row">
          <p><a href={`http://localhost:5173/imoveis/edit/${imovelData.id}`}>Ediatr</a></p>
        </div>          
        <div className="row meta">
          <h1>{imovelData.titulo}</h1>
          <div className="itens">
            <div className="item">
              <p><strong>Código:</strong></p>        
              <p>{imovelData.codigo}</p>
            </div>
            <div className="item">
              <p><strong>Tipo:</strong></p>        
              <p>{imovelData.tipo ? imovelData.tipo[0].tipo.nome : null}</p>
            </div>
            <div className="item">
              <p><strong>Finalidade:</strong></p>        
              <p>{imovelData.finalidade ? imovelData.finalidade[0].finalidade.nome : null}</p>
            </div>
            <div className="item">
              <p><strong>Valor:</strong></p>        
              <p>{imovelData.valor}</p>
            </div>
          </div>
        </div>

        <div className="carrossel">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {imovelData.fotos.map((foto, index) => (
                  <div className="embla__slide" key={index} style={{ 
                    backgroundImage: `url(${baseUrl}${foto})` 
                  }} />
                ))}
            </div>
          </div>
        </div>
        
        <div className="descricao-longa">
          <p>{imovelData.descricaoLonga}</p>
        </div>
      </div>
    </div>
  )
}

export default Imovel