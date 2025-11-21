const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function debug() {
  try {
    // Buscar todos os usuários
    const users = await db.user.findMany();
    console.log('=== USUÁRIOS ===');
    console.log(users);
    
    // Buscar todas as músicas
    const musicas = await db.musica.findMany();
    console.log('\n=== MÚSICAS ===');
    console.log(musicas);
    
    // Buscar playlists
    const playlists = await db.playlist.findMany();
    console.log('\n=== PLAYLISTS ===');
    console.log(playlists);
    
    console.log(`\nTotal: ${users.length} users, ${musicas.length} musicas, ${playlists.length} playlists`);
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await db.$disconnect();
  }
}

debug();
