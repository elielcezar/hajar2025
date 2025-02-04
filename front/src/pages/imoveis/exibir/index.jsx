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
    }catch{
      console.error('Erro ao buscar imóvel:', error);
    }        
  }  

  useEffect(() => {  
    getImovelData();
  }, []);

  useEffect(() => {  
    console.log(imovelData);
  }, [imovelData]);

  return (
    <div id="main">
      
      <div className="page-title">
        <h1>{imovelData?.titulo}</h1>
      </div>
      <div className="container">              
        <div className="row meta">
          <h1>{imovelData.titulo}</h1>
          <p><strong>Código:</strong> {imovelData.codigo}</p>        
          <p>{imovelData.descricaoCurta}</p>
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