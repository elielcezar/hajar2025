import { useState, useEffect } from "react";
import api from '../../services/api';
import './style.css';

const ListaCategorias = ( {endpoint, inputRef} ) => {

    const [categorias, setCategorias] = useState([]);

    async function getCategoria(){
        const categoriaFromAPI = await api.get(`/${endpoint}`);
        setCategorias(categoriaFromAPI.data);          
    }
    
    useEffect(() => {        
        getCategoria();               
    }, []);
    
return(
    <>    
        <select ref={inputRef}>
            <option value="">- Selecione uma opção -</option>
            {categorias.map((categoria) => (
                <option value={categoria.id} key={categoria.id}>{categoria.nome}</option>
            ))}
        </select>
    </>
)


}


export default ListaCategorias