import { useState, useRef } from 'react';
import './style.css'
import api from '../../services/api'

function CadastroImovel() { 
    
    const [confirmationMessage, setConfirmationMessage] = useState('');      
    
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

    async function handleSubmit() {

        event.preventDefault();

        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!inputTitulo.current.value || !inputCodigo.current.value || !inputSubTitulo.current.value || 
            !inputDescricaoCurta.current.value || !inputDescricaoLonga.current.value || !inputFotos.current.value || 
            !inputTipo.current.value || !inputFinalidade.current.value || !inputValor.current.value || 
            !inputEndereco.current.value || !inputCidade.current.value) {
            setConfirmationMessage('Por favor, preencha todos os campos obrigatórios.');
            setTimeout(() => setConfirmationMessage(''), 5000);
            return;
        }
        
        const formData = new FormData();
        const userData = {
            titulo: inputTitulo.current.value,
            codigo: inputCodigo.current.value,
            subTitulo: inputSubTitulo.current.value,
            descricaoCurta: inputDescricaoCurta.current.value,
            descricaoLonga: inputDescricaoLonga.current.value,
            fotos: [],
            tipo: inputTipo.current.value,
            finalidade: inputFinalidade.current.value,
            valor: inputValor.current.value,
            endereco: inputEndereco.current.value,
            cidade: inputCidade.current.value            
        };

        formData.append('titulo', userData.titulo);
        formData.append('codigo', userData.codigo);
        formData.append('subTitulo', userData.subTitulo);
        formData.append('descricaoCurta', userData.descricaoCurta);
        formData.append('descricaoLonga', userData.descricaoLonga);
        formData.append('tipo', userData.tipo);
        formData.append('finalidade', userData.finalidade);
        formData.append('valor', userData.valor);
        formData.append('endereco', userData.endereco);
        formData.append('cidade', userData.cidade);                

        // Adiciona múltiplas fotos ao FormData e ao objeto userData para log
        Array.from(inputFotos.current.files).forEach((file, index) => {
            formData.append('fotos', file);
            userData.fotos.push(file.name);
        });

        // Loga o objeto userData no console
        console.log('Dados do usuário:', JSON.stringify(userData, null, 2));

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
    <>
    <h1>Cadastrar novo imóvel</h1>
      <div className="container">        
        {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

        <form>
            <div className="form-item">
                <input type="text" name="titulo" className="titulo" placeholder='Título' ref={inputTitulo} />
            </div>           
            <div className="form-item">
                <input type="text" name="codigo" className="codigo" placeholder='Código' ref={inputCodigo} />
            </div>
            <div className="form-item">
                <input type="text" name="subTitulo" className="subTitulo" placeholder='Subtítulo' ref={inputSubTitulo} />
            </div>
            <div className="form-item">
                <input type="text" name="descricaoCurta" className="descricaoCurta" placeholder='Descrição Curta' ref={inputDescricaoCurta} />            
            </div>
            <div className="form-item">
                <input type="text" name="descricaoLonga" className="descricaoLonga" placeholder='Descrição Longa' ref={inputDescricaoLonga} />
            </div>
            <div className="form-item">
                <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
            </div>            
            <div className="form-item">
                <input type="text" name="tipo" className="tipo" placeholder='Tipo' ref={inputTipo} />
            </div>
            <div className="form-item">
                <input type="text" name="finalidade" className="finalidade" placeholder='Finalidade' ref={inputFinalidade} />
            </div>
            <div className="form-item">
                <input type="text" name="valor" className="valor" placeholder='Valor' ref={inputValor} />
            </div>
            <div className="form-item">
                <input type="text" name="endereco" className="endereco" placeholder='Endereço' ref={inputEndereco} />
            </div>
            <div className="form-item">
                <input type="text" name="cidade" className="cidade" placeholder='Cidade' ref={inputCidade} />
            </div>            
            <div className="form-item">
                <button type='button' onClick={handleSubmit}>- Enviar -</button>
            </div>
        </form>       
        
      </div>      
    </>
  )
}

export default CadastroImovel