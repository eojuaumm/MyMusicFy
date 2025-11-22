'use client'

import { atualizarPlaylist, apagarPlaylist } from "@/app/actions";
import { useState } from "react";

interface Props {
  playlist: any;
  onClose: () => void;
}

export default function PlaylistEditModal({ playlist, onClose }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Overlay para fechar */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Editar Playlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">✕</button>
        </div>

        <form action={async (formData) => {
          await atualizarPlaylist(formData);
          onClose();
        }} className="flex flex-col gap-4">
          
          <input type="hidden" name="id" value={playlist.id} />

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
            <input 
              name="nome" 
              defaultValue={playlist.nome}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
            <textarea 
              name="descricao" 
              defaultValue={playlist.descricao || ""}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 outline-none resize-none h-24"
              placeholder="Descreva a vibe desta playlist..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capa (URL)</label>
            <input 
              name="capa" 
              defaultValue={playlist.capa || ""}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 outline-none text-sm"
              placeholder="https://..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-lg shadow-purple-900/20">
              Salvar Alterações
            </button>
          </div>
        </form>

        {/* Área de Perigo */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <h3 className="text-xs font-bold text-red-400 uppercase mb-2">Zona de Perigo</h3>
          <form action={apagarPlaylist.bind(null, playlist.id)}>
            <button 
              type="submit" 
              className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition text-sm font-bold flex items-center justify-center gap-2"
              onClick={() => setIsDeleting(true)}
            >
              {isDeleting ? "Apagando..." : "🗑️ Apagar Playlist"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}