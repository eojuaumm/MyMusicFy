'use client'

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react"; 
import AboutDevModal from "./AboutDevModal"; 

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPro?: boolean; // O campo mágico que define a cor do badge
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full h-20 flex justify-between items-center px-6 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/20">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-105">
            M
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">
            MyMusicFy
          </span>
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* BOTÃO PLAYLISTS */}
              <Link 
                href="/playlists" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>
                <span className="text-sm font-medium">Biblioteca</span>
              </Link>

              <div className="h-6 w-[1px] bg-gray-800 hidden sm:block"></div>

              {/* --- ÁREA DO UTILIZADOR (DROPDOWN) --- */}
              <div className="relative" ref={menuRef}>
                
                {/* O Gatilho */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 group cursor-pointer pl-2 outline-none"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-white font-medium group-hover:text-blue-400 transition">{user.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-gray-400">Menu</p>
                  </div>
                  
                  <div className={`h-10 w-10 rounded-full bg-gray-800 border-2 overflow-hidden transition-all shadow-md ${isMenuOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent group-hover:border-blue-500/50'}`}>
                    {user.image ? (
                       <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold bg-gradient-to-br from-gray-800 to-gray-700">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </button>

                {/* --- O MENU FLUTUANTE --- */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* Cabeçalho do Menu */}
                    <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                      <p className="text-white font-bold truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{user.email}</p>
                      
                      {/* AQUI ESTÁ A LÓGICA DO BADGE DINÂMICO */}
                      {user.isPro ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-yellow-500/10">
                          <span>🏆</span> Conta PRO
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                          <span>🌱</span> Conta Gratuita
                        </div>
                      )}
                    </div>

                    {/* Opções */}
                    <div className="p-2 flex flex-col gap-1">
                      <Link 
                        href="/perfil" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" /></svg>
                        Editar Perfil
                      </Link>

                      <button 
                        onClick={() => { setShowAboutModal(true); setIsMenuOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition w-full text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-purple-400"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.202a.75.75 0 0 1-1.5 0v-.202c0-.944.606-1.657 1.336-2.108a2.25 2.25 0 0 0 .5-.332c.89-.777.89-2.036 0-2.812Zm.372 7.79a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" clipRule="evenodd" /></svg>
                        Sobre o Dev
                      </button>
                    </div>

                    <div className="h-[1px] bg-gray-800 my-1"></div>

                    {/* Rodapé com Logout */}
                    <div className="p-2">
                      <button 
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition w-full text-left font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" /></svg>
                        Sair da Conta
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-400 hover:text-white font-medium text-sm py-2 px-4 transition">Entrar</Link>
              <Link href="/registrar" className="bg-white text-black hover:bg-gray-200 font-bold text-sm py-2 px-5 rounded-full transition shadow-lg shadow-white/10">Criar Conta</Link>
            </div>
          )}
        </div>
      </nav>

      {showAboutModal && (
        <AboutDevModal onClose={() => setShowAboutModal(false)} />
      )}
    </>
  );
}