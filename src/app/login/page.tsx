'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden selection:bg-blue-500/30">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/20 shadow-2xl z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block flex items-center justify-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition">←</span> Voltar ao início
          </Link>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-text pb-2">
            Bem-vindo
          </h1>
          <p className="text-gray-400 text-sm mt-2">Faça login para entrar na sua coleção</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase mb-2 tracking-wider">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-700"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">Senha</label>
            </div>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-900/20 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Ainda não tem conta? <Link href="/registrar" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">Criar conta grátis</Link>
          </p>
        </div>

      </div>
    </main>
  );
}