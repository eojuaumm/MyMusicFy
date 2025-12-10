import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";

type MusicaWithUser = Prisma.MusicaGetPayload<{
  select: {
    id: true;
    titulo: true;
    artista: true;
    album: true;
    ano: true;
    capaUrl: true;
    previewUrl: true;
    favorito: true;
    criadoEm: true;
    user: {
      select: {
        nome: true;
      };
    };
  };
}>;

type PlaylistType = Prisma.PlaylistGetPayload<{
  select: {
    id: true;
    nome: true;
    descricao: true;
    capa: true;
    criadoEm: true;
    userId: true;
  };
}>;

export const metadata: Metadata = {
  title: "MyMusicFy - Sua música sem limites",
  description: "O MyMusicFy conecta você ao melhor do áudio com capas oficiais. Organize, descubra e reproduza as suas faixas favoritas num único lugar.",
  keywords: ["música", "playlist", "streaming", "áudio", "MyMusicFy"],
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  let musicas: MusicaWithUser[] = [];
  let playlists: PlaylistType[] = [];

  if (session?.user?.email) {
    try {
      [musicas, playlists] = await Promise.all([
        db.musica.findMany({
          where: { 
            user: { email: session.user.email } 
          },
          orderBy: { criadoEm: 'desc' },
          select: {
            id: true,
            titulo: true,
            artista: true,
            album: true,
            ano: true,
            capaUrl: true,
            previewUrl: true,
            favorito: true,
            criadoEm: true,
            user: {
              select: {
                nome: true
              }
            }
          },
          take: 100,
        }),
        db.playlist.findMany({ 
          where: { user: { email: session.user.email } }, 
          orderBy: { nome: 'asc' },
          select: {
            id: true,
            nome: true,
            descricao: true,
            capa: true,
            criadoEm: true,
            userId: true,
          },
          take: 50,
        })
      ]);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 relative overflow-hidden">
      
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600 rounded-full blur-[120px] opacity-30 animate-blob mix-blend-screen" />
        
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-purple-600 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000 mix-blend-screen" />
        
        <div className="absolute top-1/2 left-1/4 w-[50vw] h-[50vw] bg-pink-600 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-4000 mix-blend-screen" />
        
      </div>

      <Navbar user={session?.user} />

      {!session?.user ? (
        <>
          <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
            
            <div className="relative z-10 flex flex-col items-center gap-10">
              
              <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-text py-2 pb-4 drop-shadow-2xl">
                MyMusicFy
              </h1>
              <p className="sr-only">Plataforma de streaming de música com capas oficiais</p>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                
                <Link 
                  href="/registrar" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-10 rounded-xl transition shadow-xl shadow-purple-900/30 transform hover:scale-105 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                  aria-label="Criar uma nova conta no MyMusicFy"
                >
                  Criar Conta
                </Link>

                <Link 
                  href="/login" 
                  className="bg-gray-900/50 backdrop-blur-md border border-gray-700 text-gray-300 font-bold py-3 px-10 rounded-xl hover:bg-gray-800 hover:text-white hover:border-gray-500 transition transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                  aria-label="Fazer login na sua conta"
                >
                  Entrar
                </Link>
              </div>

            </div>

            <div className="absolute bottom-12 animate-bounce z-20">
              <a 
                href="#desc" 
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-110 transition cursor-pointer text-3xl text-white/70 hover:text-white backdrop-blur-xl shadow-2xl hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                title="Ver mais"
                aria-label="Rolar para a seção de descrição"
              >
                <span aria-hidden="true">+</span>
              </a>
            </div>
          </div>

          <div id="desc" className="min-h-screen flex flex-col items-center justify-center p-8 relative scroll-mt-20 bg-black/20 backdrop-blur-sm">
            
            <div className="max-w-6xl mx-auto text-center space-y-20">
              
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  A sua música, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">sem limites.</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                  O MyMusicFy conecta você ao melhor do áudio com capas oficiais. 
                  Organize, descubra e reproduza as suas faixas favoritas num único lugar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
                
                <article className="p-8 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-blue-500/30 hover:bg-gray-800/60 transition duration-500 group flex flex-col items-center hover:-translate-y-2 shadow-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-950" role="listitem">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-4xl mb-6 text-blue-400 group-hover:scale-110 transition" aria-hidden="true">
                    🎧
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Coleção Pessoal</h3>
                  <p className="text-gray-400">
                    Guarde as músicas que ama e já coloque para tocar, quando e onde quiser com ZERO anuncios! (em breve sistema de download)
                  </p>
                </article>

                <article className="p-8 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-purple-500/30 hover:bg-gray-800/60 transition duration-500 group flex flex-col items-center hover:-translate-y-2 shadow-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-950" role="listitem">
                  <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center text-4xl mb-6 text-purple-400 group-hover:scale-110 transition" aria-hidden="true">
                    📂
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Playlists</h3>
                  <p className="text-gray-400">
                    Crie playlists personalizadas para cada momento e humor. Faça uma Playlist com sua cara ;)
                  </p>
                </article>

                <article className="p-8 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-pink-500/30 hover:bg-gray-800/60 transition duration-500 group flex flex-col items-center hover:-translate-y-2 shadow-xl focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-950" role="listitem">
                  <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center text-4xl mb-6 text-pink-400 group-hover:scale-110 transition" aria-hidden="true">
                    🔍
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Busca Inteligente</h3>
                  <p className="text-gray-400">
                    Usamos uma API do Youtube para encontrar suas músicas favoritas rapidamente.
                  </p>
                </article>

              </div>

            </div>
          </div>
        </>
      ) : (
        <Dashboard musicasIniciais={musicas} playlists={playlists} />
      )}
    </main>
  );
}