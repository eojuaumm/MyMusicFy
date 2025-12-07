'use client'

import { removerMusica, toggleFavorito, adicionarMusicaNaPlaylist } from "@/app/actions";
import { useState } from "react";
import Image from "next/image";
import type { Musica, Playlist } from "@/types";
import { toast } from "sonner";
import ConfirmDialog from "./ConfirmDialog";

interface MusicModalProps {
  musica: Musica;
  playlists: Playlist[]; 
  onClose: () => void;
  onPlay: () => void;
}

export default function MusicModal({ musica, playlists, onClose, onPlay }: MusicModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState<number | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await removerMusica(musica.id);
      toast.success("Música removida com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao remover música:", error);
      toast.error("Erro ao remover música. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  }

  async function handleFavorite() {
    try {
      await toggleFavorito(musica.id);
      toast.success(
        musica.favorito ? "Removido dos favoritos" : "Adicionado aos favoritos",
        {
          description: musica.titulo,
        }
      );
    } catch (error) {
      console.error("Erro ao favoritar música:", error);
      toast.error("Erro ao atualizar favorito. Tente novamente.");
    }
  }

  async function handleAddToPlaylist(playlistId: number) {
    setIsAddingToPlaylist(playlistId);
    try {
      const result = await adicionarMusicaNaPlaylist(musica.id, playlistId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        const playlist = playlists.find(p => p.id === playlistId);
        toast.success("Música adicionada à playlist!", {
          description: playlist?.nome || "Playlist",
        });
        onClose();
      }
    } catch (error) {
      console.error("Erro ao adicionar música na playlist:", error);
      toast.error("Erro ao adicionar música na playlist. Tente novamente.");
    } finally {
      setIsAddingToPlaylist(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Botão Fechar Corrigido */}
        <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white z-10 bg-black/20 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Capa */}
        <div className="h-48 w-full bg-gray-800 relative overflow-hidden">
          {musica.capaUrl ? (
            <Image 
              src={musica.capaUrl} 
              alt={musica.titulo}
              fill
              className="object-cover"
              sizes="384px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🎵</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        <div className="p-6 pt-0 relative -top-4">
          <h2 className="text-xl font-bold text-white leading-tight truncate">{musica.titulo}</h2>
          <p className="text-blue-400 font-medium mb-6 truncate">{musica.artista}</p>

          {/* Ações */}
          {!showPlaylists ? (
            <div className="flex flex-col gap-3">
              {/* Botão Tocar Corrigido */}
              <button onClick={() => { onPlay(); onClose(); }} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" clipRule="evenodd" />
                </svg>
                Tocar Agora
              </button>

              <button onClick={() => setShowPlaylists(true)} className="w-full bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                📂 Adicionar à Playlist
              </button>

              <div className="flex gap-3">
                <button onClick={handleFavorite} className={`flex-1 py-3 rounded-xl font-bold border transition flex items-center justify-center gap-2 ${musica.favorito ? 'bg-pink-600/20 border-pink-600 text-pink-500' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}>
                  {musica.favorito ? '❤️' : '🤍'} Favoritar
                </button>
                <button 
                  onClick={() => setShowConfirmDelete(true)} 
                  disabled={isDeleting} 
                  className="flex-1 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500 text-gray-300 hover:text-red-400 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      <span>Removendo...</span>
                    </>
                  ) : (
                    <>
                      🗑️ Apagar
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            
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
                    disabled={isAddingToPlaylist === p.id}
                    className="text-left p-3 bg-gray-800 hover:bg-blue-600 rounded-lg text-white transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToPlaylist === p.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adicionando...</span>
                      </>
                    ) : (
                      <>
                        <span>💿</span>
                        {p.nome}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja remover "${musica.titulo}" da sua coleção? Esta ação não pode ser desfeita.`}
        confirmText="Sim, remover"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}