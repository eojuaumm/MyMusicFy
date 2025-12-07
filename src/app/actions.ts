'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth"; // Importar para pegar a sessão
import { authOptions } from "./api/auth/[...nextauth]/route"; // Importar as opções de auth

import type { VideoYoutube, ResultadoBusca, ActionResponse } from "@/types";

export async function buscarVideosYoutube(termo: string): Promise<ResultadoBusca[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API Key não configurada");
    return [];
  }

  // Validação do termo de busca
  if (!termo || termo.trim().length === 0) {
    return [];
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(termo.trim())}&type=video&key=${apiKey}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 } // Cache por 5 minutos
    });
    
    if (!res.ok) {
      if (res.status === 403) {
        console.error("Quota da API do YouTube excedida ou chave inválida");
        return [];
      }
      console.error(`Erro na API do YouTube: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    
    if (data.error) {
      console.error("Erro da API YouTube:", data.error);
      return [];
    }
    
    if (data.items && Array.isArray(data.items)) {
      return data.items.map((video: VideoYoutube) => ({
        id: video.id.videoId,
        titulo: video.snippet.title, 
        canal: video.snippet.channelTitle, 
        capaUrl: video.snippet.thumbnails.high.url,
        ano: new Date(video.snippet.publishedAt).getFullYear(),
        previewUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Erro no YouTube:", error);
    return [];
  }
}

export async function salvarMusicaEscolhida(video: ResultadoBusca) {
  try {
    // 1. Pegar a sessão do utilizador
    const session = await getServerSession(authOptions);
    
    // Se não estiver logado, não faz nada (segurança)
    if (!session?.user?.email) {
      throw new Error("Não autorizado");
    }

    // Validar dados básicos
    if (!video?.titulo || !video?.previewUrl) {
      throw new Error("Dados do vídeo inválidos");
    }

    // Verificar se a música já existe para evitar duplicatas
    const musicaExistente = await db.musica.findFirst({
      where: {
        previewUrl: video.previewUrl,
        user: { email: session.user.email }
      }
    });

    if (musicaExistente) {
      return { error: "Esta música já está na sua coleção" };
    }

    await db.musica.create({
      data: {
        titulo: String(video.titulo).slice(0, 200), // Limitar tamanho
        artista: String(video.canal || "Desconhecido").slice(0, 100),
        album: "YouTube",
        ano: video.ano || null,
        capaUrl: video.capaUrl || null,
        previewUrl: video.previewUrl,
        // 2. Conectar a música ao utilizador logado pelo email
        user: { 
          connect: { email: session.user.email } 
        }
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar música:", error);
    throw error;
  }
}

export async function registrarUsuario(formData: FormData) {
  try {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validação básica
    if (!nome || nome.trim().length < 2) {
      throw new Error("Nome deve ter pelo menos 2 caracteres");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Email inválido");
    }

    if (!password || password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const userJaExiste = await db.user.findUnique({ where: { email } });
    if (userJaExiste) {
      throw new Error("Este email já está em uso");
    }

    const passwordHash = await hash(password, 12);

    await db.user.create({
      data: { 
        nome: nome.trim().slice(0, 50), // Limitar tamanho
        email: email.toLowerCase().trim(), // Normalizar email
        password: passwordHash 
      }
    });
    
    redirect("/");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
}

export async function removerMusica(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  // Verificar se a música pertence ao usuário
  const musica = await db.musica.findFirst({
    where: { 
      id,
      user: { email: session.user.email }
    }
  });

  if (!musica) {
    throw new Error("Música não encontrada ou você não tem permissão");
  }

  await db.musica.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleFavorito(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  // Verificar se a música pertence ao usuário
  const musica = await db.musica.findFirst({
    where: { 
      id,
      user: { email: session.user.email }
    }
  });

  if (!musica) {
    throw new Error("Música não encontrada ou você não tem permissão");
  }

  await db.musica.update({
    where: { id },
    data: { favorito: !musica.favorito }
  });
  revalidatePath("/");
}

export async function atualizarPerfil(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const emailAtual = formData.get("emailAtual") as string;
  const nome = formData.get("nome") as string;
  const imagem = formData.get("imagem") as string;
  const novaSenha = formData.get("novaSenha") as string;

  // Verificar se o email da sessão corresponde ao email do formulário
  if (session.user.email !== emailAtual) {
    throw new Error("Você não tem permissão para atualizar este perfil");
  }

  try {
    // Validação básica
    if (nome && nome.trim().length < 2) {
      throw new Error("Nome deve ter pelo menos 2 caracteres");
    }

    if (novaSenha && novaSenha.length > 0 && novaSenha.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    // Validar URL de imagem se fornecida
    if (imagem && imagem.trim().length > 0) {
      try {
        new URL(imagem);
      } catch {
        throw new Error("URL de imagem inválida");
      }
    }

    const dadosParaAtualizar: {
      nome?: string;
      imagem?: string;
      password?: string;
    } = {};

    if (nome) {
      dadosParaAtualizar.nome = nome.trim().slice(0, 50);
    }

    if (imagem) {
      dadosParaAtualizar.imagem = imagem.trim();
    }

    if (novaSenha && novaSenha.length > 0) {
      const senhaHash = await hash(novaSenha, 12);
      dadosParaAtualizar.password = senhaHash;
    }

    await db.user.update({
      where: { email: emailAtual },
      data: dadosParaAtualizar
    });

    revalidatePath("/");
    revalidatePath("/perfil");
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}

export async function adicionarMusica(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  try {
    const titulo = formData.get("titulo") as string;
    const artista = formData.get("artista") as string;
    const previewUrl = formData.get("previewUrl") as string;
    const capaUrl = formData.get("capaUrl") as string;
    const album = formData.get("album") as string;
    const ano = formData.get("ano") as string;

    // Validação
    if (!titulo || titulo.trim().length === 0) {
      throw new Error("Título é obrigatório");
    }

    if (!artista || artista.trim().length === 0) {
      throw new Error("Artista é obrigatório");
    }

    if (!previewUrl || previewUrl.trim().length === 0) {
      throw new Error("URL de preview é obrigatória");
    }

    // Validar URL
    try {
      new URL(previewUrl);
    } catch {
      throw new Error("URL de preview inválida");
    }

    // Verificar se a música já existe
    const musicaExistente = await db.musica.findFirst({
      where: {
        previewUrl: previewUrl.trim(),
        user: { email: session.user.email }
      }
    });

    if (musicaExistente) {
      return { error: "Esta música já está na sua coleção" };
    }

    await db.musica.create({
      data: {
        titulo: titulo.trim().slice(0, 200),
        artista: artista.trim().slice(0, 100),
        album: album?.trim().slice(0, 100) || null,
        ano: ano ? parseInt(ano) : null,
        previewUrl: previewUrl.trim(),
        capaUrl: capaUrl?.trim() || null,
        user: {
          connect: { email: session.user.email }
        }
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar música:", error);
    throw error;
  }
}

export async function criarPlaylist(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const nome = formData.get("nome") as string;
  const emailUser = formData.get("emailUser") as string;

  // Verificar se o email da sessão corresponde ao email do formulário
  if (session.user.email !== emailUser) {
    throw new Error("Você não tem permissão para criar playlist para este usuário");
  }

  try {
    // Validação
    if (!nome || nome.trim().length === 0) {
      throw new Error("Nome da playlist é obrigatório");
    }

    if (nome.trim().length > 100) {
      throw new Error("Nome da playlist deve ter no máximo 100 caracteres");
    }

    const user = await db.user.findUnique({ where: { email: emailUser } });
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await db.playlist.create({
      data: {
        nome: nome.trim().slice(0, 100),
        userId: user.id
      }
    });
    
    revalidatePath("/playlists");
  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    throw error;
  }
}

export async function apagarPlaylist(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  // Verificar se a playlist pertence ao usuário
  const playlist = await db.playlist.findFirst({
    where: { 
      id,
      user: { email: session.user.email }
    }
  });

  if (!playlist) {
    throw new Error("Playlist não encontrada ou você não tem permissão");
  }

  await db.playlist.delete({ where: { id } });
  revalidatePath("/playlists");
  revalidatePath("/");
}

export async function adicionarMusicaNaPlaylist(musicaId: number, playlistId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  try {
    // Verificar se a música pertence ao usuário
    const musica = await db.musica.findFirst({
      where: { 
        id: musicaId,
        user: { email: session.user.email }
      }
    });

    if (!musica) {
      throw new Error("Música não encontrada ou você não tem permissão");
    }

    // Verificar se a playlist pertence ao usuário
    const playlist = await db.playlist.findFirst({
      where: { 
        id: playlistId,
        user: { email: session.user.email }
      }
    });

    if (!playlist) {
      throw new Error("Playlist não encontrada ou você não tem permissão");
    }

    // Verificar se a música já está na playlist
    const jaExiste = await db.playlist.findFirst({
      where: {
        id: playlistId,
        musicas: {
          some: { id: musicaId }
        }
      }
    });

    if (jaExiste) {
      return { error: "Esta música já está na playlist" };
    }

    await db.playlist.update({
      where: { id: playlistId },
      data: {
        musicas: {
          connect: { id: musicaId }
        }
      }
    });
    
    revalidatePath("/");
    revalidatePath("/playlists");
    revalidatePath(`/playlists/${playlistId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar música na playlist:", error);
    throw error;
  }
}

export async function alternarPlano(email: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  // Verificar se o email da sessão corresponde ao email passado
  if (session.user.email !== email) {
    throw new Error("Você não tem permissão para alterar este plano");
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await db.user.update({
      where: { email },
      data: { isPro: !user.isPro }
    });
    
    revalidatePath("/");
    revalidatePath("/perfil");
  } catch (error) {
    console.error("Erro ao alternar plano:", error);
    throw error;
  }
}

export async function atualizarPlaylist(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Não autorizado");
  }

  const id = parseInt(formData.get("id") as string);
  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;
  const capa = formData.get("capa") as string;

  if (isNaN(id)) {
    throw new Error("ID da playlist inválido");
  }

  // Verificar se a playlist pertence ao usuário
  const playlist = await db.playlist.findFirst({
    where: { 
      id,
      user: { email: session.user.email }
    }
  });

  if (!playlist) {
    throw new Error("Playlist não encontrada ou você não tem permissão");
  }

  await db.playlist.update({
    where: { id },
    data: { 
      nome: nome?.trim().slice(0, 100) || playlist.nome,
      descricao: descricao?.trim().slice(0, 500) || null,
      capa: capa?.trim() || null
    }
  });
  
  revalidatePath(`/playlists/${id}`);
  revalidatePath("/playlists");
}