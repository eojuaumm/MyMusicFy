'use client'

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react"; 
import AboutDevModal from "./AboutDevModal"; 

const LibraryIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5h-10.5m0 0c-.621 0-1.125.504-1.125 1.125v10.5c0 .621.504 1.125 1.125 1.125h6.75c.621 0 1.125-.504 1.125-1.125v-10.5c0-.621-.504-1.125-1.125-1.125Z" /></svg>;
const UserIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const InfoIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25 4.5 4.5m0-4.5-4.5 4.5m10.5-1.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V12Zm-7.5-1.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V12Z" /></svg>;
const LogoutIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9.75l-3 3m0 0 3 3m-3-3h7.5" /></svg>;

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
              
              
              <Link 
                href="/playlists" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                {LibraryIcon}
                <span className="text-sm font-medium">Biblioteca</span>
              </Link>

              <div className="h-6 w-[1px] bg-gray-800 hidden sm:block"></div>

              
              <div className="relative" ref={menuRef}>
                
                
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

                
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    
                    <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                      <p className="text-white font-bold truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mb-2">{user.email}</p>
                      
                      
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

                    
                    <div className="p-2 flex flex-col gap-1">
                      <Link 
                        href="/perfil" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                      >
                        {UserIcon}
                        Editar Perfil
                      </Link>

                      <button 
                        onClick={() => { setShowAboutModal(true); setIsMenuOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition w-full text-left"
                      >
                        {InfoIcon}
                        Sobre o Dev
                      </button>
                    </div>

                    <div className="h-[1px] bg-gray-800 my-1"></div>

                    
                    <div className="p-2">
                      <button 
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition w-full text-left font-medium"
                      >
                        {LogoutIcon}
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