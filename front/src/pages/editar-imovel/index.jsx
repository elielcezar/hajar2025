import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FormCategorias from '../../components/form-categorias';
import api from '../../services/api';
import './style.css';

function CadastroImovel() {    
    
    const params = useParams();
    
    const inputTitulo = useRef();
    const inputCodigo = useRef();
    const inputSubTitulo = useRef();
    const inputDescricaoCurta = useRef();
    const inputDescricaoLonga = useRef();
    const inputFotos = useRef();
    const inputTipo = useRef();
    const inputFinalidade = useRef();
    const inputValor = useRef();
    const inputEndereco = useRef();
    const inputCidade = useRef();

    const [imovelData, setImovel] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');  

    async function getImovel(){
        const imovelFromAPI = await api.get(`/imoveis/${params.id}`);
        setImovel(imovelFromAPI.data)
    }

    useEffect(() => {
        getImovel();
    }, [])

    useEffect(() => {
        if(imovelData){
            inputTitulo.current.value = imovelData.titulo;
            inputCodigo = imovelData.codigo;
            inputSubTitulo = imovelData.subTitulo;
            inputDescricaoCurta = imovelData.descricaoCurta;
            inputDescricaoLonga = imovelData.descricaoLonga;
            //inputFotos = imovelData.titulo;
            inputTipo = imovelData.tipo;
            inputFinalidade = imovelData.finalidade;
            inputValor = imovelData.valor;
            inputEndereco = imovelData.endereco;
            inputCidade = imovelData.cidade;
        }
    })

    async function handleSubmit() {

        event.preventDefault();

        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!inputTitulo.current.value || 
            !inputCodigo.current.value || 
            !inputFotos.current.value ||             
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
        Array.from(inputFotos.current.files).forEach((file, index) => {
            formData.append('fotos', file);            
        });

        // Loga o conteúdo do FormData no console
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }        

        try {            
            const response = await api.post('/imoveis', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Response:', response);

            if (response.status === 200 || response.status === 201) {                

                inputTitulo.current.value = '';
                inputCodigo.current.value = '';
                inputSubTitulo.current.value = '';
                inputDescricaoCurta.current.value = '';
                inputDescricaoLonga.current.value = '';
                inputFotos.current.value = '';                
                inputTipo.current.value = '';
                inputFinalidade.current.value = '';
                inputValor.current.value = '';
                inputEndereco.current.value = '';
                inputCidade.current.value = '';

                setConfirmationMessage('Imóvel cadastrado com sucesso!');
                setTimeout(() => setConfirmationMessage(''), 5000);
                
            } else {
                throw new Error('Erro ao cadastrar imóvel');
            }
        } catch (error) {
            console.error('Erro ao cadastrar imóvel:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            setConfirmationMessage('Erro ao cadastrar imóvel.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }
   
  return (
    <div id="main">
        <div className="container">        
            <h1>Cadastrar novo imóvel</h1>
            
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
                            <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
                        </div>
                  
                
                <div className="row">
                    
                        
                        <div className="form-item">
                            <label htmlFor="subtitulo">Código de referência</label>
                            <input type="text" name="codigo" className="codigo" ref={inputCodigo} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="tipo">Tipo de imóvel</label>
                            {/*<input type="text" name="tipo" className="tipo" placeholder='Tipo' ref={inputTipo} />*/}
                            <FormCategorias endpoint="tipo" inputRef={inputTipo} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="finalidade">Finalidade</label>
                            {/*<input type="text" name="finalidade" className="finalidade" ref={inputFinalidade} />*/}
                            <FormCategorias endpoint="finalidade" inputRef={inputFinalidade} />
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

export default CadastroImovel