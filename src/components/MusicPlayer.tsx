'use client'

import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { usePlayer } from "@/contexts/PlayerContext";

const PreviousIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const NextIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>;
const PlayBigIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.38 2.831-1.664l9.75 5.485c1.133.636 1.133 2.29 0 2.925l-9.75 5.485C6.03 20.38 4.5 19.427 4.5 18.001V5.653Z" clipRule="evenodd" /></svg>;
const PauseBigIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25ZM14.25 5.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" /></svg>;
const VolumeLowIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.642a4.48 4.48 0 0 1 0 7.916 22.81 22.81 0 0 1-5.3 4.214a1.12 1.12 0 0 1-1.272-1.026v-14.28a1.12 1.12 0 0 1 1.272-1.026c1.57-.464 3.197-.73 4.831-.768ZM9.109 17.5a30.08 30.08 0 0 1-5.858-4.908 1.12 1.12 0 0 1 0-1.684A30.08 30.08 0 0 1 9.11 6.5Z" /></svg>;
const VolumeHighIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.642a4.48 4.48 0 0 1 0 7.916 22.81 22.81 0 0 1-5.3 4.214 1.12 1.12 0 0 1-1.272-1.026v-14.28a1.12 1.12 0 0 1 1.272-1.026c1.57-.464 3.197-.73 4.831-.768Zm-10.05 0a30.08 30.08 0 0 1-5.858-4.908 1.12 1.12 0 0 1 0-1.684A30.08 30.08 0 0 1 9.11 6.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75a3.75 3.75 0 1 0 0 4.5h.375c.703 0 1.378-.314 1.874-.854.155-.17.316-.347.485-.532A.752.752 0 0 1 21 12c0-.528-.184-1.037-.521-1.428-.169-.185-.33-.362-.485-.532A2.775 2.775 0 0 0 16.125 9.75h-.375Z" /></svg>;


export default function MusicPlayer() {
  const { musicaTocando: musica, proximaMusica, musicaAnterior, fecharPlayer } = usePlayer();

  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const playerRef = useRef<any>(null);

  
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

  
  
  if (!musica || !musica.previewUrl) return null;

  return (
    <>
      
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
                      {PreviousIcon}
                    </button>
                 )}

                <button onClick={togglePlay} className={`bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition text-black shadow-lg shadow-white/20 ${isExpanded ? 'w-20 h-20' : 'w-10 h-10'}`}>
                  {isPlaying ? PauseBigIcon : PlayBigIcon}
                </button>

                {isExpanded && (
                    <button onClick={(e) => { e.stopPropagation(); proximaMusica(); }} className="text-gray-400 hover:text-white transition hover:scale-110 active:scale-95">
                      {NextIcon}
                    </button>
                 )}
              </div>

              {isExpanded && (
                <div className="w-full flex items-center gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-inner mt-4">
                  {VolumeLowIcon}
                  <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                   {VolumeHighIcon}
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