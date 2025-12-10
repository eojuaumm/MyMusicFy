import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { criarPlaylist } from "../actions";
import Link from "next/link";
import Image from "next/image";

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

  const playlists = await db.playlist.findMany({
    where: { user: { email: session.user.email } },
    include: { _count: { select: { musicas: true } } }, 
    orderBy: { criadoEm: 'desc' }
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-purple-500/30 relative overflow-hidden">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <Navbar user={session.user} />

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-text pb-2">
              Minhas Playlists
            </h1>
            <p className="text-gray-400 mt-2">Organize a banda sonora da sua vida.</p>
          </div>

          <div className="w-full md:w-auto bg-gray-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
            <form action={criarPlaylist} className="flex gap-3">
              <input type="hidden" name="emailUser" value={session.user.email} />
              <input 
                name="nome" 
                placeholder="Nova Playlist..." 
                required
                className="bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-600 w-full md:w-64 transition"
              />
              <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-2 rounded-xl transition shadow-lg shadow-purple-900/20 transform hover:scale-105 whitespace-nowrap">
                + Criar
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link 
              href={`/playlists/${playlist.id}`} 
              key={playlist.id}
              className="group relative bg-gray-900/40 border border-white/5 hover:border-purple-500/50 p-5 rounded-2xl transition-all duration-300 hover:bg-gray-800/60 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 block"
            >
              <div className="aspect-square w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition duration-500 shadow-inner border border-white/5 overflow-hidden relative">
                {playlist.capa ? (
                  <Image 
                    src={playlist.capa} 
                    alt={playlist.nome} 
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <span className="text-5xl group-hover:scale-110 transition transform duration-300 drop-shadow-lg">💿</span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-400 transition">{playlist.nome}</h3>
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-2 uppercase tracking-wider font-medium">
                  {playlist._count.musicas} {playlist._count.musicas === 1 ? 'música' : 'músicas'}
                </p>
              </div>
            </Link>
          ))}

          {playlists.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
              <div className="text-5xl mb-4 opacity-30 grayscale">📂</div>
              <p className="text-lg font-medium">Nenhuma playlist criada ainda.</p>
              <p className="text-sm text-gray-600 mt-1">Use o formulário acima para começar a sua coleção.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}