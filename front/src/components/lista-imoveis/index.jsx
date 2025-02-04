import { useState, useEffect } from "react";
import api from '@/services/api'
import styles from './styles.module.css'

export const ListaImoveis = () => {
  
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
    <div id="imoveis" className={styles.imoveis}>
        {imoveis.map((imovel) => (
            <div className={styles.item} key={imovel.id}>
                <div className={styles.card}>                        
                    <div className={styles.capa}>
                        <a href={`/imoveis/${imovel.codigo}`}>
                            <img src={`${baseUrl}${imovel.fotos[0]}`} alt="" />
                        </a>                 
                        <p className={styles.finalidade}>                                
                            {
                                imovel.finalidade && imovel.finalidade.length > 0 ? 
                                imovel.finalidade[0].finalidade.nome : 
                                null
                            }
                        </p>
                        <p className={styles.valor}>{imovel.valor}</p>
                    </div>

                    <div className={styles.content}>
                        <h3>{imovel.titulo}</h3>
                        <p className={styles.subtitulo}>{imovel.subtitulo}</p>                        
                    </div>
                </div>                
            </div>
        ))}
    </div>       
  )
}

export default ListaImoveis