'use client'

import { useState } from "react";
import { editarPlaylist } from "@/app/actions";

interface Props {
  playlist: any;
  onClose: () => void;
}

export default function PlaylistEditModal({ playlist, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    await editarPlaylist(formData);
    setIsSaving(false);
    onClose();
  }
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Editar Playlist: {playlist.nome}</h2>

        <form action={handleSubmit} className="flex flex-col gap-4">
          
          <input type="hidden" name="id" value={playlist.id} />

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Capa Atual</label>
            <div className="h-24 w-24 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
              {playlist.capaUrl ? (
                <img src={playlist.capaUrl} alt="Capa" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-600">💿</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome da Playlist</label>
            <input 
              name="nome" 
              defaultValue={playlist.nome} 
              required
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Descrição (Opcional)</label>
            <textarea 
              name="descricao" 
              defaultValue={playlist.descricao || ''}
              placeholder="Fale um pouco sobre esta playlist..."
              rows={3}
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">URL da Imagem da Capa (Opcional)</label>
            <input 
              name="capaUrl" 
              defaultValue={playlist.capaUrl || ''}
              placeholder="https://exemplo.com/sua-capa.jpg"
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 outline-none text-sm"
            />
            <p className="text-xs text-gray-600 mt-1">Cole o link da imagem aqui.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition mt-4 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>

      </div>
    </div>
  );
}