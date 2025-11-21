import { registrarUsuario } from "../actions";
import Link from "next/link";

export default function RegistrarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      
      {/* Efeito de fundo (brilho subtil atrás do cartão) */}
      <div className="absolute w-full max-w-lg h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition mb-4 inline-block">
            ← Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Criar Conta
          </h1>
          <p className="text-gray-400 text-sm mt-2">Junte-se à comunidade MyMusicFy</p>
        </div>

        <form action={registrarUsuario} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Nome</label>
            <input 
              name="nome" 
              type="text" 
              required
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-700"
              placeholder="Como te devemos chamar?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-700"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Senha</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-900/20 transform hover:scale-[1.02]">
            Registar Agora
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Já tens conta? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">Entrar</Link>
          </p>
        </div>

      </div>
    </main>
  );
}