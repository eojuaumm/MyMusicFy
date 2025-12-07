// Constantes centralizadas do projeto MyMusicFy

export const LIMITS = {
  MUSICAS_POR_PAGINA: 100,
  PLAYLISTS_POR_PAGINA: 50,
  MAX_RESULTADOS_BUSCA: 20,
  MAX_TITULO_LENGTH: 200,
  MAX_ARTISTA_LENGTH: 100,
  MAX_NOME_PLAYLIST_LENGTH: 100,
  MAX_DESCRICAO_LENGTH: 500,
  MAX_NOME_USUARIO_LENGTH: 50,
  MIN_SENHA_LENGTH: 6,
  MIN_NOME_LENGTH: 2,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registrar',
  PLAYLISTS: '/playlists',
  PROFILE: '/perfil',
  EXPLORAR: '/explorar',
} as const;

export const CACHE_TIMES = {
  YOUTUBE_SEARCH: 300, // 5 minutos
  USER_DATA: 60, // 1 minuto
  PLAYLIST_DATA: 120, // 2 minutos
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 500, // 500ms
  INPUT: 300, // 300ms
} as const;

export const MESSAGES = {
  ERROR: {
    NETWORK_ERROR: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Você precisa estar logado para fazer isso.",
    NOT_FOUND: "Recurso não encontrado.",
    VALIDATION_ERROR: "Por favor, verifique os dados informados.",
    GENERIC_ERROR: "Algo deu errado. Tente novamente.",
    MUSIC_NOT_FOUND: "Música não encontrada ou você não tem permissão.",
    PLAYLIST_NOT_FOUND: "Playlist não encontrada ou você não tem permissão.",
    ALREADY_EXISTS: "Este item já existe na sua coleção.",
  },
  SUCCESS: {
    MUSIC_ADDED: "Música adicionada com sucesso!",
    MUSIC_REMOVED: "Música removida com sucesso!",
    PLAYLIST_CREATED: "Playlist criada com sucesso!",
    PLAYLIST_UPDATED: "Playlist atualizada com sucesso!",
    PLAYLIST_DELETED: "Playlist removida com sucesso!",
    PROFILE_UPDATED: "Perfil atualizado com sucesso!",
    FAVORITE_ADDED: "Adicionado aos favoritos",
    FAVORITE_REMOVED: "Removido dos favoritos",
  },
  INFO: {
    NO_RESULTS: "Nenhum resultado encontrado",
    EMPTY_COLLECTION: "Sua coleção está vazia. Pesquise acima para adicionar!",
    EMPTY_FAVORITES: "Você ainda não favoritou nenhuma música.",
    EMPTY_PLAYLIST: "Esta playlist está vazia.",
    NO_PLAYLISTS: "Nenhuma playlist criada ainda.",
  },
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  YOUTUBE_URL_REGEX: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
} as const;

export const IMAGE_DOMAINS = {
  YOUTUBE: ['i.ytimg.com', 'img.youtube.com', 'yt3.ggpht.com', 'yt3.googleusercontent.com'],
  SPOTIFY: ['i.scdn.co', '**.scdn.co', '**.spotifycdn.com', '**.spotify.com'],
  OTHER: ['**.imgur.com', '**.cloudinary.com', '**.githubusercontent.com'],
} as const;

