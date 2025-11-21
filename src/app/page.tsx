import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { db } from "@/lib/db"; 

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Usuário não autenticado: mostrar landing público mais apresentável
    const playlists: any[] = [];
    const musicasIniciais: any[] = [];
    const userInfo = { name: 'Visitante' };

    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
        <Navbar user={undefined} />

        {/* Hero Section com Título Animado */}
        <style>{`
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .gradient-animated {
            background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080, #ff8c00);
            background-size: 300% 300%;
            animation: gradientFlow 4s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
          }
        `}</style>

        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6 gradient-animated drop-shadow-2xl fade-in-up">
            MyMusicFy
          </h1>
          <p className="text-xl md:text-2xl bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mb-8 fade-in-up" style={{ animationDelay: "0.1s" }}>
            Onde a música navega até você
          </p>

          <div className="flex items-center justify-center gap-4 mb-16 fade-in-up" style={{ animationDelay: "0.2s" }}>
            <a href="/login" className="bg-linear-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              Entrar
            </a>
            <a href="/registrar" className="border-2 border-cyan-500 bg-gray-900/50 text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800/80 transition transform hover:scale-105" style={{ borderImage: 'linear-gradient(to right, #22d3ee, #a855f7) 1' }}>
              Registrar
            </a>
          </div>

          {/* Sobre Section - Cards Layout */}
          <div className="max-w-5xl mx-auto fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-4xl font-black mb-12 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sobre o MyMusicFy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 1 */}
              <div className="bg-linear-to-br from-pink-900/40 to-orange-900/40 border border-pink-600/50 rounded-xl p-6 backdrop-blur-md hover:border-pink-400/70 transition">
                <div className="text-3xl mb-3">🎵</div>
                <h3 className="text-lg font-bold text-pink-300 mb-3">Gerenciador Completo</h3>
                <p className="text-gray-300 text-sm">Pesquise, organize e controle suas músicas com integração YouTube. Crie playlists e marque seus favoritos.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-linear-to-br from-purple-900/40 to-blue-900/40 border border-purple-600/50 rounded-xl p-6 backdrop-blur-md hover:border-purple-400/70 transition">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-bold text-purple-300 mb-3">Rápido & Limpo</h3>
                <p className="text-gray-300 text-sm">Navegação direta, carregamento rápido e controles intuitivos. Sua música sem distrações e ZERO anuncios!!.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-linear-to-br from-cyan-900/40 to-teal-900/40 border border-cyan-600/50 rounded-xl p-6 backdrop-blur-md hover:border-cyan-400/70 transition">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-bold text-cyan-300 mb-3">Tecnologia Moderna</h3>
                <p className="text-gray-300 text-sm">Next.js, React, TypeScript e Prisma. Totalmente open-source, faça parte da brincadeira você tambem! ;)</p>
              </div>
            </div>

            {/* Main Description */}
            <div className="bg-linear-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-md">
              <p className="text-gray-200 leading-relaxed mb-4">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400 font-semibold">MyMusicFy</span> é um player e gerenciador de música construído para oferecer a melhor experiência de usuário. Pesquise músicas através da integração com YouTube, crie playlists personalizadas e adicione suas másicas favoritas! Tudo isso com ZERO anuncios.
              </p>
              <p className="text-gray-200 leading-relaxed">
                O foco do projeto é <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-orange-400 font-semibold">simplicidade e eficiência</span>: carregamento rápido, controles intuitivos e organização impecável para que sua música chegue até você sem qualquer distração ou complicação.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <Dashboard musicasIniciais={musicasIniciais} playlists={playlists} userInfo={userInfo} />
          </div>
        </section>
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

  // 2. Obter o usuário para pegar seu ID
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  // 3. Obter TODAS AS MÚSICAS do usuário (Lista principal)
  const musicasIniciais = await db.musica.findMany({
    where: { userId: user?.id },
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