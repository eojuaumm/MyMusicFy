'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth"; // Importar para pegar a sessão
import { authOptions } from "./api/auth/[...nextauth]/route"; // Importar as opções de auth

export async function buscarVideosYoutube(termo: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(termo)}&type=video&key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.items) {
      return data.items.map((video: any) => ({
        id: video.id.videoId,
        titulo: video.snippet.title, 
        canal: video.snippet.channelTitle, 
        capaUrl: video.snippet.thumbnails.high.url,
        ano: new Date(video.snippet.publishedAt).getFullYear(),
        previewUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
      }));
    }
  } catch (error) {
    console.error("Erro no YouTube:", error);
  }
  return [];
}

export async function salvarMusicaEscolhida(video: any) {
  // 1. Pegar a sessão do utilizador
  const session = await getServerSession(authOptions);
  
  // Se não estiver logado, não faz nada (segurança)
  if (!session?.user?.email) return;

  await db.musica.create({
    data: {
      titulo: video.titulo,
      artista: video.canal, 
      album: "YouTube",
      ano: video.ano,
      capaUrl: video.capaUrl,
      previewUrl: video.previewUrl,
      // 2. Conectar a música ao utilizador logado pelo email
      user: { 
        connect: { email: session.user.email } 
      }
    },
  });

  revalidatePath("/");
}

export async function registrarUsuario(formData: FormData) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const userJaExiste = await db.user.findUnique({ where: { email } });
  if (userJaExiste) return;

  const passwordHash = await hash(password, 12);

  await db.user.create({
    data: { nome, email, password: passwordHash }
  });
  redirect("/");
}

export async function removerMusica(id: number) {
  await db.musica.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleFavorito(id: number) {
  const musica = await db.musica.findUnique({ where: { id } });
  if (musica) {
    await db.musica.update({
      where: { id },
      data: { favorito: !musica.favorito }
    });
  }
  revalidatePath("/");
}

export async function atualizarPerfil(formData: FormData) {
  const emailAtual = formData.get("emailAtual") as string;
  const nome = formData.get("nome") as string;
  const imagem = formData.get("imagem") as string;
  const novaSenha = formData.get("novaSenha") as string;

  let dadosParaAtualizar: any = { nome, imagem };

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
}

export async function adicionarMusica(formData: FormData) {
  // Placeholder
}

export async function criarPlaylist(formData: FormData) {
  const nome = formData.get("nome") as string;
  const emailUser = formData.get("emailUser") as string;
  
  const user = await db.user.findUnique({ where: { email: emailUser } });
  
  if (user) {
    await db.playlist.create({
      data: {
        nome,
        userId: user.id
      }
    });
    revalidatePath("/playlists");
  }
}

export async function apagarPlaylist(id: number) {
  await db.playlist.delete({ where: { id } });
  revalidatePath("/playlists");
}

export async function adicionarMusicaNaPlaylist(musicaId: number, playlistId: number) {
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
}

export async function alternarPlano(email: string) {
  const user = await db.user.findUnique({ where: { email } });
  
  if (user) {
    await db.user.update({
      where: { email },
      data: { isPro: !user.isPro }
    });
  }
  
  revalidatePath("/");
  revalidatePath("/perfil");
}

export async function atualizarPlaylist(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;
  const capa = formData.get("capa") as string;

  await db.playlist.update({
    where: { id },
    data: { 
      nome, 
      descricao, 
      capa 
    }
  });
  
  revalidatePath(`/playlists/${id}`);
  revalidatePath("/playlists");
}