import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FormCategorias from '../../components/form-categorias';
import api from '../../services/api';
import './style.css';

function EditarImovel() {    

    const [imovelData, setImovel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [finalidades, setFinalidades] = useState([]);
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
                const response = await api.get(`/imoveis/${id}`);
                setImovel(response.data);
                setExistingImages(response.data.fotos || []);
            } catch (error) {
                console.error('Erro ao buscar imóvel:', error);
                setError('Erro ao carregar dados do imóvel');
            } finally {
                setLoading(false);
            }
        }                
        fetchImovel();
    }, []);

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
                setTipos(tiposResponse.data);
                setFinalidades(finalidadesResponse.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                setError('Erro ao carregar categorias');
            }
        }
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (imovelData && !loading) {
            inputTitulo.current.value = imovelData.titulo || '';
            inputCodigo.current.value = imovelData.codigo || '';
            inputSubTitulo.current.value = imovelData.subTitulo || '';
            inputDescricaoCurta.current.value = imovelData.descricaoCurta || '';
            inputDescricaoLonga.current.value = imovelData.descricaoLonga || '';
            inputTipo.current.value = imovelData.tipo?.[0]?.tipo?.id || '';
            inputFinalidade.current.value = imovelData.finalidade?.[0]?.finalidade?.id || '';
            inputValor.current.value = imovelData.valor || '';
            inputEndereco.current.value = imovelData.endereco || '';
            inputCidade.current.value = imovelData.cidade || '';
        }
    }, [imovelData, loading]);


    if (loading) return <div>Carregando...</div>;
if (error) return <div>Erro ao carregar imóvel: {error.message}</div>;
if (!imovelData || !imovelData.tipo || !imovelData.finalidade) return <div>Imóvel não encontrado</div>;

    async function handleSubmit(event) {

        event.preventDefault();

        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!inputTitulo.current.value || 
            !inputCodigo.current.value ||             
            !inputFinalidade.current.value || 
            !inputValor.current.value || 
            !inputEndereco.current.value || 
            !inputCidade.current.value) {
            setConfirmationMessage('Por favor, preencha todos os campos obrigatórios.');
            setTimeout(() => setConfirmationMessage(''), 5000);
            return;
        }
        
        const formData = new FormData();
            formData.append('titulo', inputTitulo.current.value);
            formData.append('codigo', inputCodigo.current.value);
            formData.append('subTitulo', inputSubTitulo.current.value);
            formData.append('descricaoCurta', inputDescricaoCurta.current.value);
            formData.append('descricaoLonga', inputDescricaoLonga.current.value);
            formData.append('tipo', inputTipo.current.value);
            formData.append('finalidade', inputFinalidade.current.value);
            formData.append('valor', inputValor.current.value);
            formData.append('endereco', inputEndereco.current.value);
            formData.append('cidade', inputCidade.current.value);               

        // Adiciona múltiplas fotos ao FormData e ao objeto userData para log
        Array.from(inputFotos.current.files).forEach((file) => {
            formData.append('fotos', file);            
        });
        existingImages.forEach(image => {
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
    }
   
  return (
    <div id="main">
        <div className="container">        
            <h1>Editar imóvel</h1>
            
            

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
                    <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
                </div>
                  
                
                <div className="row">
                    
                        
                        <div className="form-item">
                            <label htmlFor="subtitulo">Código de referência</label>
                            <input type="text" name="codigo" className="codigo" ref={inputCodigo} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="tipo">Tipo de imóvel</label>                            
                            <FormCategorias endpoint="tipo" selectedId={imovelData?.tipo[0]?.tipo.id || ''} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="finalidade">Finalidade</label>                            
                            <FormCategorias endpoint="finalidade" selectedId={imovelData?.finalidade[0]?.finalidade.id || ''} />
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