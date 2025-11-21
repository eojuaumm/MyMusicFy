import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import Link from "next/link";

// CORREÇÃO 1: Definimos params como uma Promise
interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlaylistDetalhePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  // CORREÇÃO 2: Esperamos (await) os parâmetros carregarem antes de usar
  const { id } = await params;
  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <h1 className="text-xl text-red-500">Playlist inválida (ID incorreto)</h1>
      </div>
    );
  }

  // 1. Buscamos a playlist ATUAL
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    include: { musicas: true } 
  });

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <h1 className="text-xl text-gray-400">Playlist não encontrada 😕</h1>
      </div>
    );
  }

  // 2. Buscamos TODAS as playlists (para o Modal funcionar)
  const userPlaylists = session?.user?.email
    ? await db.playlist.findMany({
        where: { user: { email: session.user.email } },
        orderBy: { nome: 'asc' }
      })
    : [];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar user={session?.user} />
      
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/playlists" className="text-gray-400 hover:text-white transition flex items-center gap-1">
            <span>←</span> Voltar
          </Link>
          <div className="h-8 w-[1px] bg-gray-700"></div>
          <h1 className="text-3xl font-bold text-blue-400">{playlist.nome}</h1>
        </div>
      </div>

      {/* 3. Passamos tudo para o Dashboard */}
      <Dashboard 
        musicasIniciais={playlist.musicas} 
        playlists={userPlaylists} 
      />
    </main>
  );
}