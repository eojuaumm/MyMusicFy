import { registrarUsuario } from "../actions";
import Link from "next/link";

export default function RegistrarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden selection:bg-pink-500/30">
      
      {/* Fundo (Glow Roxo/Rosa) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/20 shadow-2xl z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block flex items-center justify-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition">←</span> Voltar ao início
          </Link>
          
          {/* Título Roxo/Rosa */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-text pb-2">
            Criar Conta
          </h1>
          <p className="text-gray-400 text-sm mt-2">Junte-se à comunidade MyMusicFy</p>
        </div>

        <form action={registrarUsuario} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-purple-400 uppercase mb-2 tracking-wider">Nome</label>
            <input 
              name="nome" 
              type="text" 
              required
              className="w-full p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition placeholder-gray-700"
              placeholder="Como te devemos chamar?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-400 uppercase mb-2 tracking-wider">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition placeholder-gray-700"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-400 uppercase mb-2 tracking-wider">Senha</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-purple-900/20 transform hover:scale-[1.02]">
            Registar Agora
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Já tem conta? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">Entrar</Link>
          </p>
        </div>

      </div>
    </main>
  );
}