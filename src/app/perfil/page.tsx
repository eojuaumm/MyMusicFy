import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { atualizarPerfil, alternarPlano } from "../actions";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);

  
  if (!session?.user?.email) {
    redirect("/login");
  }

  
  const usuario = await db.user.findUnique({
    where: { email: session.user.email }
  });

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar user={session.user} />

      <div className="max-w-2xl mx-auto p-6 mt-10">
        
        <h1 className="text-3xl font-bold mb-2">Meu Perfil 👤</h1>
        <p className="text-gray-400 mb-8">Gerencie suas informações pessoais e segurança.</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 overflow-hidden bg-gray-800 flex items-center justify-center relative group">
              {usuario.imagem ? (
                <Image 
                  src={usuario.imagem} 
                  alt="Foto de perfil" 
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-600">{usuario.nome?.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          <form action={atualizarPerfil} className="flex flex-col gap-6">
            {/* Hidden Email para identificação */}
            <input type="hidden" name="emailAtual" value={usuario.email} />

            {/* Info Pública */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-2">Informações Públicas</h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome de Exibição</label>
                <input 
                  name="nome" 
                  defaultValue={usuario.nome || ""}
                  className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Foto de Perfil (URL)</label>
                <input 
                  name="imagem" 
                  defaultValue={usuario.imagem || ""}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 outline-none text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">Cole o link de uma imagem da internet.</p>
              </div>
            </div>

            {/* Segurança */}
            <div className="space-y-4 mt-4">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider border-b border-gray-800 pb-2">Segurança</h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email (Não editável)</label>
                <input 
                  disabled
                  value={usuario.email}
                  className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Nova Senha</label>
                <input 
                  name="novaSenha" 
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition">
              Salvar Alterações
            </button>

          </form>

          {/* Plano */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Seu Plano</h3>
                <p className="text-sm text-gray-400">
                  {usuario.isPro 
                    ? "Você é um membro Premium! Aproveite a música sem limites." 
                    : "Você está no plano gratuito."}
                </p>
              </div>
              
              {/* Botão Alternar Plano */}
              <form action={alternarPlano.bind(null, usuario.email)}>
                <button 
                  type="submit"
                  className={`px-6 py-2 rounded-full font-bold transition shadow-lg ${
                    usuario.isPro
                    ? "bg-gray-800 text-red-400 hover:bg-gray-700 border border-red-500/30"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105"
                  }`}
                >
                  {usuario.isPro ? "Cancelar Premium" : "Virar PRO 🏆"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}