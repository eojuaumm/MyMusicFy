import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PlaylistContent from '@/components/PlaylistContent'; // NOVO: Importamos o componente Cliente

type PlaylistType = {
  id: number;
  nome: string;
  descricao: string | null;
  capaUrl: string | null;
  musicas: any[];
};
interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlaylistDetalhePageWrapper({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect("/login");

  const { id } = await params;
  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <h1 className="text-xl text-red-500">Playlist inválida (ID incorreto)</h1>
      </div>
    );
  }

  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    include: { musicas: true } 
  }) as PlaylistType | null;

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <h1 className="text-xl text-gray-400">Playlist não encontrada 😕</h1>
      </div>
    );
  }

  const userPlaylists = await db.playlist.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { nome: 'asc' }
  });

  return <PlaylistContent playlist={playlist} userPlaylists={userPlaylists} session={session} />;
}