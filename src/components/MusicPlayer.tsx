'use client'

import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { usePlayer } from "@/contexts/PlayerContext";

export default function MusicPlayer() {
  const { musicaTocando: musica, proximaMusica, musicaAnterior, fecharPlayer } = usePlayer();

  // 1. TODOS OS HOOKS PRIMEIRO (Sempre na mesma ordem)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const playerRef = useRef<any>(null);

  // 2. USE EFFECTS (Sempre executados, mas com proteções internas)
  useEffect(() => {
    if (musica) {
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [musica]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerRef.current && !isSeeking) {
      interval = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        if (time && !isNaN(time)) setCurrentTime(time);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSeeking]);

  // 3. LÓGICA AUXILIAR
  const getYouTubeID = (url: string | null) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  // Calculamos o ID de forma segura (se musica for null, retorna vazio)
  const videoId = musica ? getYouTubeID(musica.previewUrl) : "";

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
    if (isPlaying) event.target.playVideo();
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 0) {
      setIsPlaying(false);
      proximaMusica();
    }
    if (event.data === 1) setIsPlaying(true);
    if (event.data === 2) setIsPlaying(false);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };
  const handleSeekMouseDown = () => setIsSeeking(true);
  const handleSeekMouseUp = (e: any) => {
    const timeToSeek = parseFloat(e.target.value);
    playerRef.current.seekTo(timeToSeek);
    setIsSeeking(false);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const date = new Date(seconds * 1000);
    return date.toISOString().substr(14, 5);
  };

  // 4. VERIFICAÇÃO DE RENDERIZAÇÃO (Agora sim, no final!)
  // Se não houver música, retornamos null AQUI, depois de todos os Hooks terem passado.
  if (!musica || !musica.previewUrl) return null;

  return (
    <>
      {/* PLAYER INVISÍVEL */}
      <div style={{ position: 'fixed', top: '-10000px', opacity: 0 }}>
        <YouTube
          videoId={videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: { autoplay: 1, controls: 0, showinfo: 0, disablekb: 1 },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsExpanded(false)} />
      )}

      <div 
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`fixed bottom-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 transition-all duration-500 ease-in-out shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${isExpanded ? 'h-[600px] rounded-t-3xl' : 'h-20 cursor-pointer hover:bg-gray-900'}`}
      >
        <div className={`max-w-3xl mx-auto h-full flex flex-col p-4 ${isExpanded ? 'pb-8' : ''}`}>
          
          {isExpanded && (
            <div className="w-full flex justify-center mb-2" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
              <div className="w-12 h-1.5 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition"/>
            </div>
          )}

          <div className={`flex items-center ${isExpanded ? 'flex-col justify-center gap-6 mt-2' : 'justify-between h-full'}`}>
            
            <div className={`flex items-center gap-4 transition-all duration-500 ${isExpanded ? 'flex-col text-center' : ''}`}>
              {musica.capaUrl && (
                <img src={musica.capaUrl} alt="Capa" className={`rounded-lg shadow-lg transition-all duration-500 object-cover ${isExpanded ? 'w-64 h-64 shadow-2xl' : 'w-12 h-12'} ${isPlaying ? 'animate-pulse-slow' : ''}`} />
              )}
              <div>
                <h4 className={`text-white font-bold transition-all ${isExpanded ? 'text-2xl' : 'text-sm'}`}>{musica.titulo}</h4>
                <p className={`text-gray-400 transition-all ${isExpanded ? 'text-lg' : 'text-xs'}`}>{musica.artista}</p>
              </div>
            </div>

            {isExpanded && (
                <div className="w-full max-w-md flex items-center gap-2 text-xs text-gray-400 px-4">
                    <span>{formatTime(currentTime)}</span>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeekChange} onMouseDown={handleSeekMouseDown} onMouseUp={handleSeekMouseUp} onTouchStart={handleSeekMouseDown} onTouchEnd={handleSeekMouseUp} onClick={(e) => e.stopPropagation()} className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                    <span>{formatTime(duration)}</span>
                </div>
            )}

            <div className={`flex items-center gap-6 ${isExpanded ? 'flex-col w-full max-w-md' : ''}`}>
              <div className="flex items-center gap-8">
                 {isExpanded && (
                    <button onClick={(e) => { e.stopPropagation(); musicaAnterior(); }} className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.958l3.225 2.864c1.286 1.114 3.275.206 3.275-1.52V8.942c0-1.726-1.99-2.634-3.275-1.52l-3.225 2.864V7.328c0-1.439-1.555-2.342-2.805-1.628L2.876 9.3a3.32 3.32 0 0 0 0 5.4l6.319 3.74Z" /></svg>
                    </button>
                 )}

                <button onClick={togglePlay} className={`bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition text-black shadow-lg shadow-white/20 ${isExpanded ? 'w-20 h-20' : 'w-10 h-10'}`}>
                  {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${isExpanded ? 'w-10 h-10' : 'w-5 h-5'}`}><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${isExpanded ? 'w-10 h-10' : 'w-5 h-5'} ml-1`}><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>}
                </button>

                {isExpanded && (
                    <button onClick={(e) => { e.stopPropagation(); proximaMusica(); }} className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 transform rotate-180"><path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.958l3.225 2.864c1.286 1.114 3.275.206 3.275-1.52V8.942c0-1.726-1.99-2.634-3.275-1.52l-3.225 2.864V7.328c0-1.439-1.555-2.342-2.805-1.628L2.876 9.3a3.32 3.32 0 0 0 0 5.4l6.319 3.74Z" /></svg>
                    </button>
                 )}
              </div>

              {isExpanded && (
                <div className="w-full flex items-center gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-inner mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /></svg>
                  <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>
                </div>
              )}

              {!isExpanded && (
                <button onClick={(e) => { e.stopPropagation(); fecharPlayer(); }} className="text-gray-500 hover:text-white transition p-2">✕</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}