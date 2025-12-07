'use client'

import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import Image from "next/image";
import { usePlayer } from "@/contexts/PlayerContext";

export default function MusicPlayer() {
  const { musicaTocando: musica, proximaMusica, musicaAnterior, fecharPlayer } = usePlayer();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const playerRef = useRef<YouTubePlayer | null>(null);

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

  const getYouTubeID = (url: string | null) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

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
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    const timeToSeek = parseFloat(target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(timeToSeek);
    }
    setIsSeeking(false);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const date = new Date(seconds * 1000);
    return date.toISOString().substr(14, 5);
  };

  if (!musica || !musica.previewUrl) return null;

  return (
    <>
      <div style={{ display: 'none' }}>
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
                <div className={`relative rounded-lg shadow-lg transition-all duration-500 overflow-hidden ${isExpanded ? 'w-64 h-64 shadow-2xl' : 'w-12 h-12'} ${isPlaying ? 'animate-pulse-slow' : ''}`}>
                  <Image 
                    src={musica.capaUrl} 
                    alt="Capa" 
                    fill
                    className="object-cover"
                    sizes={isExpanded ? "256px" : "48px"}
                  />
                </div>
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
                      {/* Icone Anterior */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 0 1 0-1.953l7.108-4.062A1.125 1.125 0 0 1 21 8.688v8.123ZM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 0 1 0-1.953L9.567 7.71a1.125 1.125 0 0 1 1.683.977v8.123Z" />
                      </svg>
                    </button>
                 )}

                <button onClick={togglePlay} className={`bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition text-black shadow-lg shadow-white/20 ${isExpanded ? 'w-20 h-20' : 'w-10 h-10'}`}>
                  {isPlaying ? (
                    // Icone Pause
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`text-black ${isExpanded ? 'w-10 h-10' : 'w-5 h-5'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                  ) : (
                    // Icone Play
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`text-black ml-1 ${isExpanded ? 'w-10 h-10' : 'w-5 h-5'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
                    </svg>
                  )}
                </button>

                {isExpanded && (
                    <button onClick={(e) => { e.stopPropagation(); proximaMusica(); }} className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95">
                      {/* Icone Proximo */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 0 1 0 1.953l-7.108 4.062A1.125 1.125 0 0 1 3 16.81V8.688ZM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 0 1 0 1.953l-7.108 4.062a1.125 1.125 0 0 1-1.683-.977V8.688Z" />
                      </svg>
                    </button>
                 )}
              </div>

              {isExpanded && (
                <div className="w-full flex items-center gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-inner mt-4">
                  {/* Icone Volume Baixo */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                  </svg>
                  
                  <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                   
                   {/* Icone Volume Alto */}
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                  </svg>
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