import { useParams } from 'react-router-dom';
import './style.css'

function Imovel() {  

  const params = useParams(); 

     
  return (
    <>
      <h1>{params.id}</h1> 
    </>
  )
}

export default Imovel