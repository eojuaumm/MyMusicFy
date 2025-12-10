export type Musica = {
  id: number;
  titulo: string;
  artista: string;
  album: string | null;
  ano: number | null;
  capaUrl: string | null;
  previewUrl: string | null;
  favorito: boolean;
  criadoEm?: Date;
  user?: { nome: string | null } | null;
};

export type Playlist = {
  id: number;
  nome: string;
  descricao: string | null;
  capa: string | null;
  criadoEm: Date;
  userId: string;
  musicas?: Musica[];
  _count?: { musicas: number };
};

export type ResultadoBusca = {
  id: string;
  titulo: string;
  canal: string;
  capaUrl: string;
  previewUrl: string;
  ano: number;
};

export type VideoYoutube = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
};

export type ActionResponse<T = void> = 
  | { success: true; data?: T }
  | { success: false; error: string };

