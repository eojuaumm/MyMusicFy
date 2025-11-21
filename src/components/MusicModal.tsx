'use client'

import { removerMusica, toggleFavorito, adicionarMusicaNaPlaylist } from "@/app/actions";
import { useState } from "react";

interface MusicModalProps {
  musica: any;
  playlists: any[]; // <--- Recebe as playlists do usuário
  onClose: () => void;
  onPlay: () => void;
}

export default function MusicModal({ musica, playlists, onClose, onPlay }: MusicModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false); // Controla qual tela mostra

  async function handleDelete() {
    if (confirm("Tem certeza que quer apagar esta música?")) {
      setIsDeleting(true);
      await removerMusica(musica.id);
      onClose();
    }
  }

  async function handleFavorite() {
    await toggleFavorito(musica.id);
  }

  async function handleAddToPlaylist(playlistId: number) {
    await adicionarMusicaNaPlaylist(musica.id, playlistId);
    alert("Música adicionada com sucesso!");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white z-10 bg-black/20 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
        </button>

        {/* Cabeçalho com Capa */}
        <div className="h-48 w-full bg-gray-800 relative">
          {musica.capaUrl ? <img src={musica.capaUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-6xl">🎵</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        <div className="p-6 pt-0 relative -top-4">
          <h2 className="text-xl font-bold text-white leading-tight truncate">{musica.titulo}</h2>
          <p className="text-blue-400 font-medium mb-6 truncate">{musica.artista}</p>

          {/* --- TELA 1: OPÇÕES NORMAIS --- */}
          {!showPlaylists ? (
            <div className="flex flex-col gap-3">
              <button onClick={() => { onPlay(); onClose(); }} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                Tocar Agora
              </button>

              <button onClick={() => setShowPlaylists(true)} className="w-full bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                📂 Adicionar à Playlist
              </button>

              <div className="flex gap-3">
                <button onClick={handleFavorite} className={`flex-1 py-3 rounded-xl font-bold border transition flex items-center justify-center gap-2 ${musica.favorito ? 'bg-pink-600/20 border-pink-600 text-pink-500' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}>
                  {musica.favorito ? '❤️' : '🤍'} Favoritar
                </button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500 text-gray-300 hover:text-red-400 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  🗑️ Apagar
                </button>
              </div>
            </div>
          ) : (
            /* --- TELA 2: LISTA DE PLAYLISTS --- */
            <div className="animate-in slide-in-from-right">
              <div className="flex items-center gap-2 mb-4 cursor-pointer text-gray-400 hover:text-white" onClick={() => setShowPlaylists(false)}>
                <span>← Voltar</span>
              </div>
              <h3 className="text-white font-bold mb-3">Escolha a pasta:</h3>
              
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {playlists.length === 0 && <p className="text-gray-500 text-center py-4">Nenhuma playlist criada.</p>}
                
                {playlists.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handleAddToPlaylist(p.id)}
                    className="text-left p-3 bg-gray-800 hover:bg-blue-600 rounded-lg text-white transition flex items-center gap-3"
                  >
                    <span>💿</span>
                    {p.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}