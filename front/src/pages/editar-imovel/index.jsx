import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ListaCategorias from '../../components/form-categorias';
import api from '../../services/api';
import './style.css';

function EditarImovel() {    

    const [confirmationMessage, setConfirmationMessage] = useState('');  

    const [imovelData, setImovel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tipo, setTipo] = useState('');
    const [finalidade, setFinalidade] = useState('');
    const [existingImages, setExistingImages] = useState([]);

    const inputTitulo = useRef(null);
    const inputCodigo = useRef(null);
    const inputSubTitulo = useRef(null);
    const inputDescricaoCurta = useRef(null);
    const inputDescricaoLonga = useRef(null);
    const inputFotos = useRef(null);
    const inputTipo = useRef(null);
    const inputFinalidade = useRef(null);
    const inputValor = useRef(null);
    const inputEndereco = useRef(null);
    const inputCidade = useRef(null); 
    
    const { id } = useParams();

    useEffect(() => {
        async function fetchImovel() {
            try {
                const response = await api.get(`/imoveis/id/${id}`);
                setImovel(response.data);
                setExistingImages(response.data.fotos || []);
                setTipo(response.data.tipo[0]?.tipo.id);
                setFinalidade(response.data.finalidade[0]?.finalidade.id);
                setLoading(false);
            } catch (error) {
                setError('Erro ao buscar imóvel:', error);
                setLoading(false);
            }
        }                
        fetchImovel();
    }, [id]);

    useEffect(() => {
        console.log(imovelData);
    });

    useEffect(() => {
        async function fetchCategorias() {
            try {
                const [tiposResponse, finalidadesResponse] = await Promise.all([
                    api.get('/tipo'),
                    api.get('/finalidade')
                ]);
                setTipo(tiposResponse.data);
                setFinalidade(finalidadesResponse.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                setError('Erro ao carregar categorias');
            }
        }
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (imovelData && !loading) {
            if (inputTitulo.current) inputTitulo.current.value = imovelData.titulo || '';
            if (inputCodigo.current) inputCodigo.current.value = imovelData.codigo || '';
            if (inputSubTitulo.current) inputSubTitulo.current.value = imovelData.subTitulo || '';
            if (inputDescricaoCurta.current) inputDescricaoCurta.current.value = imovelData.descricaoCurta || '';
            if (inputDescricaoLonga.current) inputDescricaoLonga.current.value = imovelData.descricaoLonga || '';
            if (inputTipo.current) inputTipo.current.value = imovelData.tipo?.[0]?.tipo?.id || '';
            if (inputFinalidade.current) inputFinalidade.current.value = imovelData.finalidade?.[0]?.finalidade?.id || '';
            if (inputValor.current) inputValor.current.value = imovelData.valor || '';
            if (inputEndereco.current) inputEndereco.current.value = imovelData.endereco || '';
            if (inputCidade.current) inputCidade.current.value = imovelData.cidade || '';
        }
    }, [imovelData, loading]);


    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro ao carregar imóvel: {error.message}</div>;
    if (!imovelData || !imovelData.tipo || !imovelData.finalidade) return <div>Imóvel não encontrado</div>;

    async function handleSubmit(event) {

        event.preventDefault();

        /*const updatedImovel = {
            codigo: inputCodigo.current.value,
            valor: inputValor.current.value,
            endereco: inputEndereco.current.value,
            tipo,
            finalidade
        };*/

        //console.log('Updated Imovel:', updatedImovel); // Log the updated data

        // Verificar se todos os campos obrigatórios estão preenchidos
        /*if (!inputTitulo.current?.value || 
            !inputCodigo.current?.value ||             
            !inputFinalidade.current?.value || 
            !inputValor.current?.value || 
            !inputEndereco.current?.value || 
            !inputCidade.current?.value) {
            setConfirmationMessage('Por favor, preencha todos os campos obrigatórios.');
            setTimeout(() => setConfirmationMessage(''), 5000);
            return;
        }*/
        
            const formData = new FormData();
            formData.append('titulo', inputTitulo.current?.value || '');
            formData.append('codigo', inputCodigo.current?.value || '');
            formData.append('subTitulo', inputSubTitulo.current?.value || '');
            formData.append('descricaoCurta', inputDescricaoCurta.current?.value || '');
            formData.append('descricaoLonga', inputDescricaoLonga.current?.value || '');
            /*formData.append('tipo', inputTipo.current?.value || '');
            formData.append('finalidade', inputFinalidade.current?.value || '');*/
            formData.append('valor', inputValor.current?.value || '');
            formData.append('endereco', inputEndereco.current?.value || '');
            formData.append('cidade', inputCidade.current?.value || '');
            formData.append('tipo', tipo);
            formData.append('finalidade', finalidade);

        
        // Adiciona múltiplas fotos ao FormData
        if (inputFotos.current && inputFotos.current.files) {
            Array.from(inputFotos.current.files).forEach((file) => {
                formData.append('fotos', file);            
            });
        }

        // Adiciona as imagens existentes ao FormData
        existingImages.forEach((image) => {
            formData.append('existingFotos', image);
        });

        // Loga o conteúdo do FormData no console
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }        

        try {
            await api.put(`/imoveis/${id}`, formData);
            setConfirmationMessage('Imóvel atualizado com sucesso!');
            setTimeout(() => setConfirmationMessage(''), 5000);
        } catch (error) {
            console.error('Erro ao atualizar imóvel:', error);
            setConfirmationMessage('Erro ao atualizar imóvel.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }

            /*try {
                const response = await api.put(`/imoveis/${id}`, updatedImovel);
                console.log('Response:', response.data); // Log the response from the backend
                setConfirmationMessage('Imóvel atualizado com sucesso!');
            } catch (error) {
                console.error('Error updating imovel:', error);
                setError('Erro ao atualizar imóvel.');
            }*/

        console.log('Dados enviados:', formData);
    }

    function handleDeleteImage(image) {
        setExistingImages(existingImages.filter(img => img !== image));
    }
   
  return (
    <div id="main">
        <div className="container">        
            <h1>Editar imóvel</h1>  

            {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}          

            <form>                
                <div className="form-item">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" name="titulo" className="titulo" ref={inputTitulo} />
                </div>                             
                <div className="form-item">
                    <label htmlFor="subtitulo">Subtítulo</label>
                    <input type="text" name="subTitulo" className="subTitulo" ref={inputSubTitulo} />
                </div>

                <div className="form-item">
                    <label htmlFor="subtitulo">Descrição curta</label>
                    <input type="text" name="descricaoCurta" className="descricaoCurta" ref={inputDescricaoCurta} />            
                </div>
                <div className="form-item">   
                    <label htmlFor="subtitulo">Descrição longa</label>             
                    <textarea name="descricaoLonga" className="descricaoLonga" ref={inputDescricaoLonga}></textarea>
                </div>               
                <div className="form-item">
                    <label htmlFor="subtitulo">Fotos</label>
                    <div className="existing-images">
                            {existingImages.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={`http://localhost:3000/uploads/${image}`} alt={`Imagem ${index + 1}`} />
                                    <button type="button" onClick={() => handleDeleteImage(image)}>Excluir</button>
                                </div>
                            ))}
                        </div>
                    <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
                </div>
                  
                
                <div className="row">
                    
                        
                        <div className="form-item">
                            <label htmlFor="subtitulo">Código de referência</label>
                            <input type="text" name="codigo" className="codigo" ref={inputCodigo} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="tipo">Tipo de imóvel</label>
                            <ListaCategorias endpoint="tipo" selectedId={tipo} onChange={setTipo} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="finalidade">Finalidade</label>
                            <ListaCategorias endpoint="finalidade" selectedId={finalidade} onChange={setFinalidade} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="subtitulo">Valor</label>
                            <input type="text" name="valor" className="valor" ref={inputValor} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="subtitulo">Endereço</label>
                            <input type="text" name="endereco" className="endereco" ref={inputEndereco} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="subtitulo">Cidade</label>
                            <input type="text" name="cidade" className="cidade" ref={inputCidade} />
                        </div>      
                    
                </div>{/*row*/}

                <div className="form-item">
                    <button type='button' onClick={handleSubmit}>- Enviar -</button>
                </div>

            </form>       
        </div>      
    </div>
  )
}

export default EditarImovel