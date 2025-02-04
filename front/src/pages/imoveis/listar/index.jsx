import { useState, useEffect } from "react";
import api from '@/services/api'
import './style.css'

export const Imoveis = () => {
  
    const [imoveis, setImoveis] = useState([]);

    async function getImoveis(){
        const imoveisFromAPI = await api.get('/imoveis')
        setImoveis(imoveisFromAPI.data);        
    } 
  
    useEffect(() => {
        getImoveis();        
    }, [])

    useEffect(() => {        
        console.log('Imoveis:', imoveis)
    }, [imoveis])

  const baseUrl = 'http://localhost:3000/uploads/'

  return (
    <div id="main">
        <div className="container">
        <h1>Nossos Imóveis</h1>
        <div id="imoveis">
            {imoveis.map((imovel) => (
                <div className="item" key={imovel.id}>
                    <div className="card">
                        
                        <div className="capa">
                            <a href={`/imoveis/${imovel.codigo}`}>
                                <img src={`${baseUrl}${imovel.fotos[0]}`} alt="" />
                            </a>                 
                            <p className="finalidade">                                
                                {
                                    imovel.finalidade && imovel.finalidade.length > 0 ? 
                                    imovel.finalidade[0].finalidade.nome : 
                                    null
                                }
                            </p>
                            <p className="valor">{imovel.valor}</p>
                        </div>

                        <div className="content">
                            <h3>{imovel.titulo}</h3>
                            <p className="subtitulo">{imovel.subtitulo}</p>                        
                        </div>
                    </div>                
                </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default Imoveis