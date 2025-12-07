'use client'

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react"; 
import AboutDevModal from "./AboutDevModal"; 

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPro?: boolean; 
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lista de botões de navegação
  const navLinks = [
    { 
      name: "Início", 
      href: "/", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    { 
      name: "Explorar", 
      href: "/explorar", // ATUALIZADO AQUI: Link para a nova página
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    },
    { 
      name: "Playlists", 
      href: "/playlists", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Navbar Fixa com Efeito Vidro */}
      <nav className="fixed top-0 left-0 w-full h-20 flex justify-between items-center px-6 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-lg">
        
        {/* Logo Estático (Não Clicável) com Animação de Cor */}
        <div className="flex items-center gap-3 select-none cursor-default">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">
            M
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text hidden sm:block">
            MyMusicFy
          </span>
        </div>

        {/* Botões de Navegação Centrais (Apenas visíveis se logado e em telas maiores) */}
        {user && (
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 bg-white/5 border border-white/5 rounded-full p-1 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        )}

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              
              {/* Mobile: Botão Biblioteca (ícone apenas) */}
              <Link 
                href="/playlists" 
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              </Link>

              <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

              {/* Menu do Usuário */}
              <div className="relative" ref={menuRef}>
                
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 group cursor-pointer outline-none"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-white font-medium group-hover:text-blue-400 transition">{user.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-gray-400">Menu</p>
                  </div>
                  
                  <div className={`h-10 w-10 rounded-full bg-gray-800 border-2 overflow-hidden transition-all shadow-md relative ${isMenuOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/10 group-hover:border-blue-500/50'}`}>
                    {user.image ? (
                       <Image 
                         src={user.image} 
                         alt="Avatar" 
                         fill
                         className="object-cover"
                         sizes="40px"
                       />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold bg-gradient-to-br from-gray-800 to-gray-700">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                    
                    {/* Header do Menu */}
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <p className="text-white font-bold truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mb-3">{user.email}</p>
                      
                      {user.isPro ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-yellow-500/10">
                          <span>🏆</span> Conta PRO
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                          <span>🌱</span> Conta Gratuita
                        </div>
                      )}
                    </div>

                    {/* Opções */}
                    <div className="p-2 flex flex-col gap-1">
                      <Link 
                        href="/perfil" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        Editar Perfil
                      </Link>

                      <button 
                        onClick={() => { setShowAboutModal(true); setIsMenuOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition w-full text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        Sobre o Dev
                      </button>
                    </div>

                    <div className="h-[1px] bg-white/10 my-1 mx-2"></div>

                    {/* Sair */}
                    <div className="p-2">
                      <button 
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition w-full text-left font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>
                        Sair da Conta
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-400 hover:text-white font-medium text-sm py-2 px-4 transition hover:bg-white/5 rounded-xl">Entrar</Link>
              <Link href="/registrar" className="bg-white text-black hover:bg-gray-200 font-bold text-sm py-2 px-5 rounded-xl transition shadow-lg shadow-white/10 hover:scale-105 transform">Criar Conta</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer para compensar a navbar fixa */}
      <div className="h-20"></div>

      {showAboutModal && (
        <AboutDevModal onClose={() => setShowAboutModal(false)} />
      )}
    </>
  );
}