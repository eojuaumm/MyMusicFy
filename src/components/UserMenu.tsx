'use client'

import { signOut } from "next-auth/react";

// Este componente recebe o nome do usuário como "propriedade"
export default function UserMenu({ nome }: { nome: string }) {
  return (
    <div className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg border border-gray-700">
      <div className="flex flex-col text-right">
        <span className="text-sm text-gray-400">Logado como</span>
        <span className="font-bold text-white">{nome}</span>
      </div>
      
      <button 
        onClick={() => signOut()} // Função mágica do NextAuth que faz logout
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded transition"
      >
        Sair
      </button>
    </div>
  );
}