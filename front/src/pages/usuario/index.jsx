import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import './style.css'

export const Usuario = () => {

    const  params = useParams();
    const [userData, setUserData] = useState('');   

    async function getUser(){
        const userFromAPI = await api.get(`usuarios/${params.id}`);
        setUserData(userFromAPI.data);        
    }

    useEffect(() => {
        getUser();               
    }, []);

    useEffect(() => {    
        if (userData) {
            inputName.current.value = userData.name || '';
            inputEmail.current.value = userData.email || '';
            //inputPassword.current.value = userData.password || '';
            inputPhotos.current.value = userData.photos || '';
        }
    }, [userData]); 

    async function updateUser(){

    }   

    const [confirmationMessage, setConfirmationMessage] = useState(''); 

    const inputName = useRef();    
    const inputEmail = useRef();
    const inputPassword = useRef();
    const inputPhotos = useRef();

    return (

        <div className="container">
            <h1>{userData.name}</h1>
            <form>
                <div className="form-item">
                    <input type="text" name="name" className="name" placeholder='Nome' ref={inputName}  />
                </div>           
                <div className="form-item">
                    <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} />
                </div>
                <div className="form-item">
                    <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} />
                </div>    
                <div className="form-item">
                    <input type="text" name="photos" className="photos" placeholder='Fotos' ref={inputPhotos} />
                </div>          
                <div className="form-item">
                    <button type='button' onClick={updateUser}>- Enviar -</button>
                </div>
            </form>   
        </div>
    )
}

export default Usuario