'use client'

import { useState, useRef, useEffect } from "react";
import { buscarVideosYoutube, salvarMusicaEscolhida } from "@/app/actions";
import MusicModal from "./MusicModal";
import { usePlayer } from "@/contexts/PlayerContext"; // <--- IMPORTAR

// ... (Tipos Musica e ResultadoBusca continuam iguais) ...
type Musica = {
  id: number;
  titulo: string;
  artista: string;
  album: string | null;
  ano: number | null;
  capaUrl: string | null;
  previewUrl: string | null;
  favorito: boolean;
  user?: { nome: string | null } | null;
};

type ResultadoBusca = {
  id: string;
  titulo: string;
  canal: string;
  capaUrl: string;
  previewUrl: string;
  ano: number;
};

// Adiciona 'playlists' aqui
export default function Dashboard({ musicasIniciais, playlists = [] }: { musicasIniciais: Musica[], playlists?: any[] }) {
  const [musicaSelecionada, setMusicaSelecionada] = useState<Musica | null>(null);
  
  // USAR O CONTEXTO EM VEZ DE ESTADO LOCAL
  const { tocarMusica } = usePlayer(); 

  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setResultados([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termoBusca.trim()) return;
    setIsSearching(true);
    setResultados([]);
    const videos = await buscarVideosYoutube(termoBusca);
    setResultados(videos);
    setIsSearching(false);
  };

  const handleSelectVideo = async (video: ResultadoBusca) => {
    setIsSaving(true);
    await salvarMusicaEscolhida(video);
    setIsSaving(false);
    setResultados([]);
    setTermoBusca("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* --- BUSCA (CÓDIGO IGUAL AO ANTERIOR) --- */}
      <div ref={searchContainerRef} className="max-w-3xl mx-auto mb-12 relative z-20">
        <form onSubmit={handleSearch} className="relative flex items-center">
          {/* ... (input e botão iguais) ... */}
          <div className="absolute left-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" /></svg>
          </div>
          <input type="text" value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} placeholder="O que queres ouvir hoje?" className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-32 text-white text-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-xl placeholder-gray-500 transition-all focus:bg-gray-800" />
          <button type="submit" disabled={isSearching || !termoBusca} className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition disabled:opacity-50">{isSearching ? "..." : "Buscar"}</button>
        </form>

        {/* ... (Lista de resultados igual) ... */}
        {resultados.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {resultados.map((video) => (
                <div key={video.id} onClick={() => handleSelectVideo(video)} className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition group border-b border-gray-800 last:border-0">
                  <img src={video.capaUrl} alt={video.titulo} className="w-24 h-14 object-cover rounded-lg shadow-sm group-hover:scale-105 transition" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate text-sm" dangerouslySetInnerHTML={{__html: video.titulo}} />
                    <p className="text-gray-400 text-xs truncate mt-1">{video.canal} • {video.ano}</p>
                  </div>
                  <div className="bg-gray-800 group-hover:bg-blue-600 text-gray-400 group-hover:text-white p-2 rounded-full transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- BIBLIOTECA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {musicasIniciais.map((musica) => (
          <div 
            key={musica.id} 
            onClick={() => setMusicaSelecionada(musica)}
            className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300 relative cursor-pointer"
          >
            {/* ... (Visual do Card igual) ... */}
            <div className="aspect-video w-full bg-gray-800 relative group-hover:scale-105 transition duration-500">
              {musica.capaUrl ? <img src={musica.capaUrl} alt={musica.titulo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-800">🎵</div>}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <div className="bg-blue-600 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition duration-300 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                 </div>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold text-white mb-1 truncate" title={musica.titulo}>{musica.titulo}</h2>
              <p className="text-gray-400 text-sm truncate">{musica.artista}</p>
            </div>
          </div>
        ))}
      </div>

      {musicaSelecionada && (
        <MusicModal 
          musica={musicaSelecionada}
          playlists={playlists} 
          onClose={() => setMusicaSelecionada(null)} 
          // AGORA USAMOS A FUNÇÃO GLOBAL DO CONTEXTO
          onPlay={() => tocarMusica(musicaSelecionada, musicasIniciais)} 
        />
      )}

      {/* O PLAYER FOI REMOVIDO DAQUI PORQUE JÁ ESTÁ NO LAYOUT */}

    </div>
  );
}