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
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      
      {/* Efeito de fundo (brilho subtil) */}
      <div className="absolute w-full max-w-lg h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition mb-4 inline-block">
            ← Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Bem-vindo
          </h1>
          <p className="text-gray-400 text-sm mt-2">Faça login para aceder à sua coleção</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition placeholder-gray-700"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Senha</label>
            </div>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full p-3 rounded-lg bg-gray-950 border border-gray-800 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-purple-900/20 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Ainda não tem conta? <Link href="/registrar" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">Criar conta grátis</Link>
          </p>
        </div>

      </div>
    </main>
  );
}