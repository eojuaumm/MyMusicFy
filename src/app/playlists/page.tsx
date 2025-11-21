import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import Link from "next/link";

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
);


export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/login");

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
    orderBy: { nome: 'asc' }
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar user={session?.user} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-8">Minhas Playlists</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">

          {/* Card para Criar Nova Playlist (mantido como exemplo) */}
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-xl aspect-square hover:bg-gray-700/80 transition group border-2 border-dashed border-gray-600">
            <PlusIcon className="w-10 h-10 text-gray-400 group-hover:text-white transition" />
            <span className="text-sm font-semibold text-gray-400 group-hover:text-white mt-2">Criar Nova Playlist</span>
          </button>
          
          {playlists.map((playlist) => (
            <Link 
              key={playlist.id} 
              href={`/playlists/${playlist.id}`} 
              className="block group"
            >
              <div className="w-full aspect-square bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20">
                
                {playlist.capaUrl ? (
                    <img 
                        src={playlist.capaUrl} 
                        alt={`Capa da playlist ${playlist.nome}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <span className="text-8xl text-gray-500">💿</span>
                    </div>
                )}
                
              </div>
              <h2 className="text-white font-bold text-lg mt-3 truncate">{playlist.nome}</h2>
              <p className="text-gray-400 text-sm">{playlist.musicas.length} Músicas</p>
            </Link>
          ))}

        </div>
      </div>
    </main>
  );
}