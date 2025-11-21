'use client'

interface Props {
  onClose: () => void;
}

export default function AboutDevModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center text-3xl shadow-lg mb-4">
            🎵
          </div>
          <h2 className="text-2xl font-bold text-white">MyMusicFy v2.5</h2>
          
          
          <a 
            href="https://instagram.com/eojuaumm"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 text-sm mt-1 hover:text-pink-500 transition cursor-pointer inline-block border-b border-transparent hover:border-pink-500"
            title="Ir para o Instagram"
          >
            by: @eojuaumm
          </a>

        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
            <h3 className="font-bold text-blue-400 text-sm uppercase mb-2">Desenvolvedor</h3>
            <p className="text-white">Criei essa merda de madrugada só pra descobrir mais sobre a ferramenta do Next ;)</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
            <h3 className="font-bold text-purple-400 text-sm uppercase mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Next.js 15</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">TypeScript</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Prisma</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">SQLite</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Tailwind</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onClose} className="text-gray-500 hover:text-white text-sm transition underline">
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}