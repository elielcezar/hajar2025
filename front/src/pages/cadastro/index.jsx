import { useEffect, useState, useRef } from 'react';
import './style.css'
import api from '../../services/api'

function Home() { 
    
    const [confirmationMessage, setConfirmationMessage] = useState('');  
 
    const inputName = useRef();    
    const inputEmail = useRef();
    const inputPassword = useRef();
    const inputPhotos = useRef();

    async function createUser() {
        
        const formData = new FormData();
        const userData = {
            name: inputName.current.value,
            email: inputEmail.current.value,
            password: inputPassword.current.value,
            photos: []
        };

        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);

        // Adiciona múltiplas fotos ao FormData e ao objeto userData para log
        Array.from(inputPhotos.current.files).forEach((file, index) => {
            formData.append('photos', file);
            userData.photos.push(file.name);
        });

        // Loga o objeto userData no console
        //console.log('Dados do usuário:', JSON.stringify(userData, null, 2));

        // Loga o conteúdo do FormData no console
        /*for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }*/

        try {
            const response = await api.post('/usuarios', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {                

                inputName.current.value = '';
                inputEmail.current.value = '';
                inputPassword.current.value = '';
                inputPhotos.current.value = '';

                setConfirmationMessage('Usuário cadastrado com sucesso!');
                setTimeout(() => setConfirmationMessage(''), 5000);
            } else {
                throw new Error('Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            setConfirmationMessage('Erro ao cadastrar usuário.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }
   
  return (
    <>
    <h1>Cadastrar novo usuário</h1>
      <div className="container">        
        {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

        <form>
            <div className="form-item">
                <input type="text" name="name" className="name" placeholder='Nome' ref={inputName} />
            </div>           
            <div className="form-item">
                <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} />
            </div>
            <div className="form-item">
                <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} />
            </div>
            <div className="form-item">
                <input type="file" name="photos" className="photos" ref={inputPhotos} multiple />
            </div>
            <div className="form-item">
                <button type='button' onClick={createUser}>- Enviar -</button>
            </div>
        </form>       
        
      </div>      
    </>
  )
}

export default Home