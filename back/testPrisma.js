// filepath: testPrisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Teste de criação de usuário
    const newUser = await prisma.user.create({
        data: {
            email: 'teste@exemplo.com',
            name: 'Teste',
            age: '30',
            password: 'senha123',
            createdAt: new Date()
        }
    });
    console.log('Usuário criado:', newUser);

    // Teste de listagem de usuários
    const users = await prisma.user.findMany();
    console.log('Usuários encontrados:', users);
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });