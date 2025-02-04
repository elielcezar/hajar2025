import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';

const prisma = new PrismaClient();
const router = express.Router();

// Configuração do multer para armazenar arquivos localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Criar imovel
router.post('/imoveis', upload.array('fotos'), async (req, res) => {
    console.log('Recebendo requisição POST /imoveis');
    
    const { 
        titulo, 
        codigo, 
        subTitulo, 
        descricaoCurta, 
        descricaoLonga,
        tipo,
        finalidade,
        valor,
        endereco,
        cidade
    } = req.body;
    const fotos = req.files.map(file => file.filename);

    try {
        console.log('Dados recebidos:', {titulo, codigo, subTitulo, descricaoCurta, descricaoLonga, tipo, finalidade, valor, endereco, cidade, fotos});        
        
        const response = await prisma.imovel.create({
            data: {
                titulo, 
                codigo, 
                subTitulo, 
                descricaoCurta, 
                descricaoLonga,                
                valor,
                endereco,
                cidade,                
                createdAt: new Date(),
                fotos: fotos,
                tipo: {
                    create: [{
                        tipo: {
                            connect: {
                                id: tipo
                            }
                        }
                    }]
                },
                finalidade: {
                    create: [{
                        finalidade: {
                            connect: {
                                id: finalidade
                            }
                        }
                    }]
                }
            },
            include: {
                tipo: true,
                finalidade: true
            }
        });
        console.log('Imóvel criado:', response);
        res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar imóvel:', error);
        res.status(500).json({ error: 'Erro ao criar imóvel' });
    }
})

// Listar imoveis
router.get('/imoveis', async (req, res) => {

    try {
        console.log('Recebendo requisição GET /imoveis');
        console.log('Query params:', req.query);

        // Criar objeto de filtro apenas com parâmetros definidos
        const filtro = {};
        if (req.query.codigo) filtro.codigo = req.query.codigo;                
        if (req.query.cidade) filtro.cidade = req.query.cidade;
        if (req.query.tipo) {
            filtro.tipo = {
                some: {
                    tipo: {
                        nome: req.query.tipo
                    }
                }
            }
        }
        if (req.query.finalidade) {
            filtro.finalidade = {
                some: {
                    finalidade: {
                        nome: req.query.finalidade
                    }
                }
            }
        }         

        const imoveis = await prisma.imovel.findMany({
            where: filtro,
            include: {
                tipo: {
                    include: {
                        tipo: true
                    }
                },
                finalidade: {
                    include: {
                        finalidade: true
                    }
                }
            }
        });

        console.log('Imóveis encontrados:', imoveis);
        res.status(200).json(imoveis);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }

});

// Obter imovel pelo ID
router.get('/imoveis/id/:id', async (req, res) => {
    try{
        const {id} = req.params;

        const imovel = await prisma.imovel.findUnique({
            where: {
                id: id
            },
            include: {
                tipo: {
                    include: {
                        tipo: true
                    }
                },
                finalidade: {
                    include: {
                        finalidade: true
                    }
                }
            }
        });
        if(!imovel){
            return res.status(404).json({
                error: 'Imóvel não encontrado'
            })
        }
        res.json(imovel);
    }catch(error){
        console.error('Erro ao buscar imóvel:', error);
        res.status(500).json({
            error: 'Erro ao buscar imóvel'
        });
    }
});


// Obter imovel pelo codigo do cadastro
router.get('/imoveis/:codigo', async (req, res) => {
    try{
        console.log('Recebendo requisição GET /imoveis/:codigo');
        console.log('Código:', req.params.codigo);

        const {codigo} = req.params;
        const imovel = await prisma.imovel.findMany({
            where: {
                codigo: codigo
            },
            include: {
                tipo: {
                  include: {
                    tipo: true
                  }
                },
                finalidade: {
                  include: {
                    finalidade: true
                  }
                }
              }
        });
        if(!imovel){
            return res.status(404).json({
                error: 'Imóvel não encontrado'
            })
        }
        res.json(imovel);        
        console.log('Imóvel encontrados:', imovel);
    }catch(error){
        console.error('Erro ao buscar imóvel:', error);
        res.status(500).json({
            error: 'Erro ao buscar imóvel'
        });
    }
});

// Atualizar imovel
router.put('/imoveis/:id', upload.array('fotos'), async (req, res) => {    

    try{
        console.log('Recebendo requisição PUT /imoveis');    

        const { id } = req.params;
        const {
            titulo,
            codigo,
            subTitulo,
            descricaoCurta,
            descricaoLonga,
            tipo,
            finalidade,
            valor,
            endereco,
            cidade,
            oldPhotos
        } = req.body;

        console.log('req.body:', req.body);

        let fotos = [];
        if (oldPhotos) {
            fotos = JSON.parse(oldPhotos); // Converte string JSON para array
        }
        if (req.files && req.files.length > 0) {
            const novasFotos = req.files.map(file => file.filename);
            fotos = [...fotos, ...novasFotos]; // Mescla arrays
        }

        const data = {
            titulo,
            codigo,
            subTitulo,
            descricaoCurta,
            descricaoLonga,
            valor,
            endereco,
            cidade,
            fotos
        };

        console.log('data:', data);

        const response = await prisma.imovel.update({
            where: { id },
            data: data,
            include: {
                tipo: true,
                finalidade: true
            }
        });

        await prisma.imovelTipo.deleteMany({
            where: { imovelId: id }
          });
          await prisma.imovelTipo.create({
            data: {
              imovelId: id,
              tipoId: tipo
            }
        });

        await prisma.imovelFinalidade.deleteMany({
            where: { imovelId: id }
          });
          await prisma.imovelFinalidade.create({
            data: {
              imovelId: id,
              finalidadeId: finalidade
            }
        });
        
        console.log('Imóvel atualizado:', response);
        res.status(200).json(response);
    }catch (error){
        console.error('Erro ao atualizar imóvel:', error);
        res.status(500).json({ error: 'Erro ao atualizar imóvel' });
    }
});

export default router;


