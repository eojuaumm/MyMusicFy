import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { criarPlaylist, apagarPlaylist } from "../actions";
import Link from "next/link";

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

  // Busca as playlists do usuário e conta quantas músicas tem cada uma
  const playlists = await db.playlist.findMany({
    where: { user: { email: session.user.email } },
    include: { _count: { select: { musicas: true } } }, // Conta as músicas
    orderBy: { criadoEm: 'desc' }
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar user={session.user} />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          Minhas Playlists 📂
        </h1>

        {/* FORMULÁRIO DE CRIAR NOVA */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Criar Nova Playlist</h2>
          <form action={criarPlaylist} className="flex gap-4">
            <input type="hidden" name="emailUser" value={session.user.email} />
            <input 
              name="nome" 
              placeholder="Nome da Playlist (Ex: Treino, Relax...)" 
              required
              className="flex-1 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-lg transition">
              Criar
            </button>
          </form>
        </div>

        {/* GRID DE PLAYLISTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link 
              href={`/playlists/${playlist.id}`} 
              key={playlist.id}
              className="block group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-xl hover:border-blue-500 transition shadow-lg hover:shadow-blue-500/10 relative"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition transform duration-300">
                💿
              </div>
              <h3 className="text-xl font-bold truncate group-hover:text-blue-400 transition">{playlist.nome}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {playlist._count.musicas} músicas
              </p>

              {/* Botão de Apagar (Pequeno X no canto) */}
              <form action={apagarPlaylist.bind(null, playlist.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <button className="text-gray-500 hover:text-red-500 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </Link>
          ))}

          {playlists.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">
              Nenhuma playlist criada ainda.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}