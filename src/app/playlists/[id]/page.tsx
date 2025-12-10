import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import Link from "next/link";
import Image from "next/image";
import PlaylistEditButton from "@/components/PlaylistEditButton";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlaylistDetalhePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }
  
  const { id } = await params;
  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <h1 className="text-xl text-red-500">Playlist inválida</h1>
      </div>
    );
  }
  
  const playlist = await db.playlist.findFirst({
    where: { 
      id: playlistId,
      user: { email: session.user.email }
    },
    include: { musicas: true } 
  });

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-400">Playlist não encontrada 🔒</h1>
        <p className="text-gray-500">Esta playlist não existe ou você não tem permissão para vê-la.</p>
        <Link href="/playlists" className="text-blue-400 hover:text-blue-300 transition">
          Voltar às minhas playlists
        </Link>
      </div>
    );
  }
  
  const userPlaylists = await db.playlist.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { nome: 'asc' }
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-purple-500/30 relative">
      
      <div className="fixed inset-0 z-0">
        {playlist.capa ? (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-[100px] scale-110"
            style={{ backgroundImage: `url(${playlist.capa})` }}
          />
        ) : (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/80 to-gray-950" />
      </div>

      <div className="relative z-10">
        <Navbar user={session?.user} />
        
        <div className="max-w-7xl mx-auto px-6 pt-10">
          
          <div className="mb-8">
            <Link 
              href="/playlists" 
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all backdrop-blur-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Voltar
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
            
            <div className="group relative w-52 h-52 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-gray-800 flex items-center justify-center">
              {playlist.capa ? (
                <Image 
                  src={playlist.capa} 
                  alt={playlist.nome} 
                  fill
                  className="object-cover"
                  sizes="208px"
                />
              ) : (
                <span className="text-6xl">💿</span>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-2">Playlist</p>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 line-clamp-2">
                    {playlist.nome}
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl leading-relaxed line-clamp-2">
                    {playlist.descricao || "Sem descrição definida."}
                  </p>
                </div>
                
                <PlaylistEditButton playlist={playlist} />
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white">{session?.user?.name}</span>
                </div>
                <span>•</span>
                <span>{playlist.musicas.length} músicas</span>
              </div>
            </div>
          </div>

          <Dashboard 
            musicasIniciais={playlist.musicas} 
            playlists={userPlaylists} 
            allowSearch={false}
            allowFilters={false} 
          />
        </div>
      </div>
    </main>
  );
}