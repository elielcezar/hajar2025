import { useState, useEffect } from "react";
import api from '../../services/api';
import './style.css';

const ListaCategorias = ( {endpoint, selectedId} ) => {

    const [categorias, setCategorias] = useState([]);
    const [selectedValue, setSelectedValue] = useState(selectedId);

    async function getCategoria(){
        const categoriaFromAPI = await api.get(`/${endpoint}`);
        setCategorias(categoriaFromAPI.data);          
    }
    
    useEffect(() => {        
        getCategoria();               
    }, []);

    useEffect(() => {
        setSelectedValue(selectedId);
    }, [selectedId]);   
    
    
return(
    <>    
        <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
            <option value="">- Selecione uma opção -</option>
            {categorias.map((categoria) => (
                <option value={categoria.id} key={categoria.id}>{categoria.nome}</option>
            ))}
        </select>
    </>
)


}


export default ListaCategorias