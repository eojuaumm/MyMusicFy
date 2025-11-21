'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePlayer } from '@/contexts/PlayerContext';
import { buscarVideosYoutube, salvarMusicaEscolhida } from "@/app/actions";
import MusicModal from "./MusicModal";

const SearchIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const PlusIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const PlayCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.02-1.203a.75.75 0 0 0 0-1.094l-4.5-3a.75.75 0 0 0-1.25.5v6a.75.75 0 0 0 1.25.5l4.5-3Z" clipRule="evenodd" /></svg>;


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

interface DashboardProps {
  musicasIniciais: Musica[]; // Agora aceita a lista diretamente
  playlists: any[];          // Lista de playlists para o Modal
  userInfo: any;             // Dados do usuário para a saudação
}


export default function Dashboard({ musicasIniciais, playlists = [], userInfo }: DashboardProps) {
  const { tocarMusica } = usePlayer();
  
  const [musicaSelecionada, setMusicaSelecionada] = useState<Musica | null>(null);
  
  // Estados da Busca
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Lógica da Saudação Dinâmica
  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

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
    <div className="pt-8 pb-28 px-6 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. SAUDAÇÃO DINÂMICA */}
        <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-10 pt-4">
          {greeting}, {userInfo.name || 'Usuário'}!
        </h1>

        {/* 2. ÁREA DE BUSCA ANTIGA (Centralizada e Simples) */}
        <div ref={searchContainerRef} className="max-w-xl mx-auto mb-12 relative z-20">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              {SearchIcon}
            </div>
            
            <input 
              type="text" 
              value={termoBusca} 
              onChange={(e) => setTermoBusca(e.target.value)} 
              placeholder="Pesquisar Música ou Artista" 
              className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-12 pr-32 text-white text-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-xl placeholder-gray-500 transition-all focus:bg-gray-800" 
            />
            
            <button 
              type="submit" 
              disabled={isSearching || !termoBusca} 
              className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition disabled:opacity-50"
            >
              {isSearching ? "..." : "Buscar"}
            </button>
          </form>

          {/* LISTA DE RESULTADOS (DROPDOWN) */}
          {resultados.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {resultados.map((video) => (
                  <div key={video.id} onClick={() => handleSelectVideo(video)} className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition group border-b border-gray-800 last:border-0">
                    <img src={video.capaUrl} alt={video.titulo} className="w-24 h-14 object-cover rounded-lg shadow-sm group-hover:scale-105 transition" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate text-sm">{video.titulo}</h4>
                      <p className="text-gray-400 text-xs truncate mt-1">{video.canal} • {video.ano}</p>
                    </div>
                    <div className="bg-gray-800 group-hover:bg-blue-600 text-gray-400 group-hover:text-white p-2 rounded-full transition">
                      {PlusIcon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. LISTA PRINCIPAL DE MÚSICAS (GRID ANTIGO) */}
        <h2 className="text-white text-3xl font-bold mb-6">Sua Coleção</h2>
        
        {musicasIniciais.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p className="text-6xl mb-4">🎹</p>
            <p className="text-xl">Sua biblioteca está vazia.</p>
            <p className="text-sm">Use a barra acima para adicionar músicas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {musicasIniciais.map((musica) => (
              <div 
                key={musica.id} 
                onClick={() => setMusicaSelecionada(musica)}
                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300 relative cursor-pointer"
              >
                
                <div className="aspect-video w-full bg-gray-800 relative group-hover:scale-105 transition duration-500">
                  {musica.capaUrl ? (
                    <img src={musica.capaUrl} alt={musica.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-800">🎵</div>
                  )}
                  {musica.favorito && (
                    <div className="absolute top-2 right-2 bg-pink-600 text-white p-1.5 rounded-full shadow-lg z-10">❤️</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                     <div className="bg-blue-600 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition duration-300 shadow-xl">
                        {PlayCircleIcon}
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
        )}

      </div>
      
      {musicaSelecionada && (
        <MusicModal 
          musica={musicaSelecionada}
          playlists={playlists} 
          onClose={() => setMusicaSelecionada(null)} 
          onPlay={() => tocarMusica(musicaSelecionada, musicasIniciais)} 
        />
      )}

    </div>
  );
}