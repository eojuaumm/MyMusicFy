'use client'

import { createContext, useContext, useState, ReactNode } from "react";

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

interface PlayerContextType {
  musicaTocando: Musica | null;
  playlist: Musica[];
  tocarMusica: (musica: Musica, listaCompleta: Musica[]) => void;
  proximaMusica: () => void;
  musicaAnterior: () => void;
  fecharPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType>({} as PlayerContextType);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [musicaTocando, setMusicaTocando] = useState<Musica | null>(null);
  const [playlist, setPlaylist] = useState<Musica[]>([]);

  function tocarMusica(musica: Musica, listaCompleta: Musica[]) {
    setMusicaTocando(musica);
    setPlaylist(listaCompleta);
  }

  function fecharPlayer() {
    setMusicaTocando(null);
  }

  function proximaMusica() {
    if (!musicaTocando || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(m => m.id === musicaTocando.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setMusicaTocando(playlist[nextIndex]);
  }

  function musicaAnterior() {
    if (!musicaTocando || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(m => m.id === musicaTocando.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setMusicaTocando(playlist[prevIndex]);
  }

  return (
    <PlayerContext.Provider value={{ 
      musicaTocando, 
      playlist, 
      tocarMusica, 
      proximaMusica, 
      musicaAnterior,
      fecharPlayer
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);