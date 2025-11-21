'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

// --- FUNÇÃO 1: BUSCAR LISTA NO YOUTUBE (Não salva nada, só devolve dados) ---
export async function buscarVideosYoutube(termo: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  // Pedimos 5 resultados (maxResults=5)
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(termo)}&type=video&maxResults=5&key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.items) {
      // Limpamos os dados para o frontend usar fácil
      return data.items.map((video: any) => ({
        id: video.id.videoId,
        titulo: video.snippet.title, // Título do vídeo
        canal: video.snippet.channelTitle, // Nome do canal (usaremos como artista)
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

// --- FUNÇÃO 2: SALVAR O VÍDEO ESCOLHIDO ---
export async function salvarMusicaEscolhida(video: any) {
  await db.musica.create({
    data: {
      titulo: video.titulo,
      artista: video.canal, // Usamos o nome do canal como Artista provisório
      album: "YouTube",
      ano: video.ano,
      capaUrl: video.capaUrl,
      previewUrl: video.previewUrl,
    },
  });

  revalidatePath("/");
}

// --- AS OUTRAS FUNÇÕES (REGISTRAR, REMOVER, ETC) CONTINUAM IGUAIS ---
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

// Mantemos a função antiga vazia ou removemos se não for usada, 
// mas o novo Dashboard vai usar as novas funções acima.
export async function adicionarMusica(formData: FormData) {
  // Esta função fica obsoleta com o novo dashboard
}

export async function criarPlaylist(formData: FormData) {
  const nome = formData.get("nome") as string;
  
  // Precisamos do ID do usuário. Como é uma Server Action, usamos um "truque"
  // Na prática real, pegamos da sessão, mas aqui vamos buscar pelo email que passaremos no form
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

// --- ADICIONAR MÚSICA A UMA PLAYLIST ---
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
// --- GERIR PLANO (Simulação de Pagamento) ---
export async function alternarPlano(email: string) {
  // 1. Descobre como está agora
  const user = await db.user.findUnique({ where: { email } });
  
  if (user) {
    // 2. Inverte (Se era false vira true)
    await db.user.update({
      where: { email },
      data: { isPro: !user.isPro }
    });
  }
  
  revalidatePath("/");
  revalidatePath("/perfil");
}