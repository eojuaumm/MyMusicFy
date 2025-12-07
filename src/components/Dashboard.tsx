'use client'

import { useState, useRef, useEffect } from "react";
import { buscarVideosYoutube, salvarMusicaEscolhida } from "@/app/actions";
import MusicModal from "./MusicModal";
import { usePlayer } from "@/contexts/PlayerContext"; 
import Link from "next/link";
import Image from "next/image";
import type { Musica, Playlist, ResultadoBusca } from "@/types";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export default function Dashboard({ 
  musicasIniciais, 
  playlists = [], 
  allowSearch = true,
  allowFilters = true
}: { 
  musicasIniciais: Musica[], 
  playlists?: Playlist[],
  allowSearch?: boolean,
  allowFilters?: boolean
}) {
  const [musicaSelecionada, setMusicaSelecionada] = useState<Musica | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'favoritos'>('todos');
  
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

  // Debounced search para busca em tempo real
  const debouncedSearch = useDebouncedCallback(
    async (termo: string) => {
      if (!termo.trim()) {
        setResultados([]);
        return;
      }
      setIsSearching(true);
      try {
        const videos = await buscarVideosYoutube(termo);
        setResultados(videos);
        if (videos.length === 0) {
          toast.info("Nenhum resultado encontrado");
        }
      } catch (error) {
        console.error("Erro na busca:", error);
        toast.error("Erro ao buscar músicas. Tente novamente.");
      } finally {
        setIsSearching(false);
      }
    },
    500 // 500ms de delay
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termoBusca.trim()) return;
    await debouncedSearch(termoBusca);
  };

  const handleSelectVideo = async (video: ResultadoBusca) => {
    setIsSaving(true);
    try {
      const result = await salvarMusicaEscolhida(video);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Música adicionada com sucesso!", {
          description: video.titulo,
        });
        // Sucesso - limpar busca
        setResultados([]);
        setTermoBusca("");
      }
    } catch (error) {
      console.error("Erro ao salvar música:", error);
      toast.error("Erro ao adicionar música. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShuffle = () => {
    const listaAtual = filtro === 'favoritos' 
      ? musicasIniciais.filter(m => m.favorito) 
      : musicasIniciais;
    
    if (listaAtual.length > 0) {
      const randomIndex = Math.floor(Math.random() * listaAtual.length);
      tocarMusica(listaAtual[randomIndex], listaAtual);
    }
  };

  const musicasExibidas = musicasIniciais.filter(musica => {
    if (filtro === 'favoritos') return musica.favorito;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* Barra de Pesquisa - Controlada por allowSearch */}
      {allowSearch && (
        <div ref={searchContainerRef} className="max-w-3xl mx-auto mb-8 relative z-20">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-4 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.44 4.19l3.58 3.58a1 1 0 01-1.42 1.42l-3.58-3.58A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>

            <input 
              type="text" 
              value={termoBusca} 
              onChange={(e) => {
                setTermoBusca(e.target.value);
                debouncedSearch(e.target.value);
              }}
              placeholder="O que queres ouvir hoje?" 
              className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-32 text-white text-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-xl placeholder-gray-500 transition-all focus:bg-gray-800" 
            />
            <button 
              type="submit" 
              disabled={isSearching || !termoBusca.trim()} 
              className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Buscando...</span>
                </>
              ) : (
                "Buscar"
              )}
            </button>
          </form>

          {resultados.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {resultados.map((video) => (
                  <div 
                    key={video.id} 
                    onClick={() => handleSelectVideo(video)} 
                    className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition group border-b border-gray-800 last:border-0"
                  >
                    <Image 
                      src={video.capaUrl} 
                      alt={video.titulo} 
                      width={96}
                      height={56}
                      className="w-24 h-14 object-cover rounded-lg shadow-sm group-hover:scale-105 transition"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate text-sm">{video.titulo}</h4>
                      <p className="text-gray-400 text-xs truncate mt-1">{video.canal} • {video.ano}</p>
                    </div>
                    <div className={`bg-gray-800 group-hover:bg-blue-600 text-gray-400 group-hover:text-white p-2 rounded-full transition ${isSaving ? 'opacity-50 cursor-wait' : ''}`}>
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barra de Ações Rápidas - Controlada por allowFilters */}
      {allowFilters && (
        <div className="flex flex-wrap gap-3 mb-8 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          
          <button 
            onClick={() => setFiltro('todos')}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 ${filtro === 'todos' ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-transparent'}`}
          >
            Todas
          </button>

          <button 
            onClick={() => setFiltro('favoritos')}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 flex items-center gap-2 ${filtro === 'favoritos' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-lg shadow-pink-900/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-transparent'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="m9.653 16.915-3.797 3.236c-.996.848-2.507.27-2.507-1.075V3.25C3.348 1.95 4.607 1 5.938 1h8.124c1.331 0 2.59 1.05 2.59 2.25v15.826c0 1.345-1.51 1.923-2.507 1.075l-3.797-3.236a1.125 1.125 0 0 0-1.37 0Z" />
            </svg>
            Favoritas
          </button>

          <div className="w-[1px] h-8 bg-gray-800 hidden sm:block mx-2"></div>

          <button 
            onClick={handleShuffle}
            className="px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
            Aleatório
          </button>

          <Link 
            href="/playlists"
            className="px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2 border border-gray-700 hover:border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            Minhas Playlists
          </Link>

        </div>
      )}

      {/* Lista de Músicas (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {musicasExibidas.length === 0 && (
           <div className="col-span-full text-center py-12 text-gray-500">
             {filtro === 'favoritos' 
               ? 'Você ainda não favoritou nenhuma música.' 
               : allowSearch 
                 ? 'Sua coleção está vazia. Pesquise acima para adicionar!' 
                 : 'Esta playlist está vazia.'}
           </div>
        )}

        {musicasExibidas.map((musica) => (
          <div 
            key={musica.id} 
            onClick={() => setMusicaSelecionada(musica)}
            className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300 relative cursor-pointer"
          >
            <div className="aspect-video w-full bg-gray-800 relative group-hover:scale-105 transition duration-500 overflow-hidden">
              {musica.capaUrl ? (
                <Image 
                  src={musica.capaUrl} 
                  alt={musica.titulo} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-800">🎵</div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <div className="bg-blue-600 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition duration-300 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" clipRule="evenodd" />
                    </svg>
                 </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                  <h2 className="text-lg font-bold text-white mb-1 truncate" title={musica.titulo}>{musica.titulo}</h2>
                  <p className="text-gray-400 text-sm truncate">{musica.artista}</p>
                </div>
                {musica.favorito && (
                  <span className="text-pink-500 text-xs animate-pulse">❤️</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {musicaSelecionada && (
        <MusicModal 
          musica={musicaSelecionada}
          playlists={playlists} 
          onClose={() => setMusicaSelecionada(null)} 
          onPlay={() => tocarMusica(musicaSelecionada, musicasExibidas)} 
        />
      )}

    </div>
  );
}