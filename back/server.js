import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client'
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Configuração do multer para armazenar arquivos localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

/* POST - CREATE --------------------------------------*/
app.post('/usuarios', upload.array('photos'), async (req, res) => {
    console.log('Recebendo requisição POST /usuarios');
    
    const { name, email, password } = req.body;
    const photos = req.files;

    try {
        console.log('Dados recebidos:', { name, email, password, photos });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                createdAt: new Date(),
                photos: photos.map(file => file.path) // Armazena os caminhos dos arquivos
            }
        });
        console.log('Usuário criado:', response);
        res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }

    /*await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,            
            password: req.body.password
        }
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    res.status(201).json(req.body);*/
});

/* GET - READ ----------------------------------------*/
app.get('/usuarios', async (req, res) => {

    console.log('Recebendo requisição GET /usuarios');

    let users = [];    

    if(req.query){
        users = await prisma.user.findMany({
            where:{
                name: req.query.name,
                email: req.query.email,
                password: req.query.password
            }
        })
    }else{
        users = await prisma.user.findMany();
    }
    console.log('Usuários encontrados:', users);
    res.status(200).json(users);

});

/* PUT - UPDATE ---------------------------------------*/
app.put('/usuarios/:id', async (req, res) => {    
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,            
            password: req.body.password
        }
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    res.status(200).json(req.body);
});


/* DELETE ---------------------------------------------*/
app.delete('/usuarios/:id', async (req, res) => {    
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({
        message: 'Usuario deletado com sucesso'
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
})

/* LOGIN ---------------------------------------------*/
app.post('/login', async (req, res) => {
    
    const { email, password } = req.body;
    console.log(email, password)

    try {
        // Verifique se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Compare a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha inválida' });
        }

        // Se a senha for válida, retorne uma resposta de sucesso
        res.status(200).json({ message: 'Login bem-sucedido', user });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

