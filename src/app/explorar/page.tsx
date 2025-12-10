import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function ExplorarPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 relative overflow-hidden">
      
      <Navbar user={session?.user} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        
        <div className="mb-8 p-8 bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-blue-900/20 animate-bounce">
          <span className="text-6xl">🚀</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-gradient-text mb-6 pb-2">
          Em Breve
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Estamos a construir uma nova forma de descobrir o seu próximo som favorito. 
          <br className="hidden md:block" />
          A funcionalidade <span className="text-blue-400 font-semibold">Explorar</span> trará recomendações inteligentes personalizadas para si.
        </p>

        <Link 
          href="/"
          className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 hover:scale-105 backdrop-blur-md hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar ao Início
        </Link>

      </div>
    </main>
  );
}