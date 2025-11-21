'use client'

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import Link from "next/link";
import PlaylistEditModal from '@/components/PlaylistEditModal';

type PlaylistType = {
  id: number;
  nome: string;
  descricao: string | null;
  capaUrl: string | null;
  musicas: any[];
};

export default function PlaylistContent({ playlist, userPlaylists, session }: { playlist: PlaylistType, userPlaylists: any[], session: any }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(playlist);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar user={session?.user} />
      
      <div className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* CABEÇALHO DA PLAYLIST */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gray-900 border border-gray-800 rounded-xl">
            
            {/* Capa da Playlist */}
            <div className="w-28 h-28 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
                {currentPlaylist.capaUrl ? (
                    <img src={currentPlaylist.capaUrl} alt="Capa" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-6xl text-blue-500/50">💿</span>
                )}
            </div>

            {/* Nome e Botão */}
            <div>
                <Link href="/playlists" className="text-gray-500 hover:text-white transition text-xs uppercase font-bold tracking-wider">
                    ← Minhas Playlists
                </Link>
                <h1 className="text-4xl font-extrabold text-white mt-1">{currentPlaylist.nome}</h1>
                <p className="text-gray-400 text-sm mt-2">{currentPlaylist.descricao || "Sem descrição."}</p>
                <button onClick={() => setShowEditModal(true)} className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" /></svg>
                    Editar Informações
                </button>
            </div>
        </div>

      </div>

      <Dashboard 
        musicasIniciais={currentPlaylist.musicas} 
        playlists={userPlaylists} 
      />

      {/* O MODAL DE EDIÇÃO */}
      {showEditModal && (
        <PlaylistEditModal 
          playlist={currentPlaylist} 
          onClose={() => setShowEditModal(false)}
        />
      )}
    </main>
  );
}