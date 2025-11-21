const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function fixMusicas() {
  try {
    // Buscar o usuário (você)
    const user = await db.user.findUnique({
      where: { email: 'osms49@gmail.com' }
    });
    
    if (!user) {
      console.error('Usuário não encontrado!');
      return;
    }
    
    console.log(`Usuário encontrado: ${user.email} (ID: ${user.id})`);
    
    // Atualizar todas as músicas com userId = null para o ID do usuário
    const resultado = await db.musica.updateMany({
      where: { userId: null },
      data: { userId: user.id }
    });
    
    console.log(`✅ ${resultado.count} músicas atualizadas com sucesso!`);
    
    // Verificar quantas músicas o usuário tem agora
    const musicasDoUsuario = await db.musica.findMany({
      where: { userId: user.id }
    });
    
    console.log(`Total de músicas do usuário agora: ${musicasDoUsuario.length}`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await db.$disconnect();
  }
}

fixMusicas();
