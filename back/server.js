import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuariosRoutes from './routes/usuarios.js'
import imoveisRoutes from './routes/imoveis.js'
import loginRoutes from './routes/login.js'

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rotas especificas para cada caso
app.use(usuariosRoutes);
app.use(imoveisRoutes);
app.use(loginRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});