import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { db } from "@/lib/db"; 

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Usuário não autenticado: renderiza versão pública sem forçar login
    const playlists: any[] = [];
    const musicasIniciais: any[] = [];
    const userInfo = { name: 'Visitante' };

    return (
      <main className="min-h-screen bg-gray-950">
        <Navbar user={null} />
        <Dashboard musicasIniciais={musicasIniciais} playlists={playlists} userInfo={userInfo} />
      </main>
    );
  }

  // 1. Obter Playlists do Usuário
  const playlists = await db.playlist.findMany({
    where: { user: { email: session.user.email } },
    select: {
      id: true,
      nome: true,
      capaUrl: true,
      musicas: {
        select: { id: true }
      }
    },
    orderBy: { criadoEm: 'desc' },
    take: 6,
  });

  // 2. Obter TODAS AS MÚSICAS do usuário (Lista principal)
  const musicasIniciais = await db.musica.findMany({
    where: { userId: session.user.id },
    select: {
        id: true,
        titulo: true,
        artista: true,
        capaUrl: true,
        previewUrl: true,
        favorito: true,
        album: true,
        ano: true,
    },
    orderBy: { criadoEm: 'desc' },
  }) as any[];

  return (
    <main className="min-h-screen bg-gray-950">
      <Navbar user={session?.user} />
      {/* PASSAMOS PROPS DIRETAS */}
      <Dashboard 
        musicasIniciais={musicasIniciais} 
        playlists={playlists} 
        userInfo={session.user} 
      />
    </main>
  );
}