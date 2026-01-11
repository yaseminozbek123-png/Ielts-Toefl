
import React, { useState } from 'react';
import { AppMode } from './types';
import VocabGame from './components/VocabGame';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.GAME);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      <main className="flex-1">
        {activeMode === AppMode.GAME ? (
          <VocabGame />
        ) : (
          <div className="p-4 safe-top">
             <ImageEditor />
             <div className="max-w-4xl mx-auto mt-8">
                <button 
                  onClick={() => setActiveMode(AppMode.GAME)}
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl"
                >
                  Back to Quiz
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Lab Shortcut Button - floating or bottom fixed for PWA feel */}
      {activeMode === AppMode.GAME && (
        <button 
          onClick={() => setActiveMode(AppMode.LAB)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white shadow-2xl rounded-2xl border border-gray-100 flex items-center justify-center text-2xl z-50 hover:scale-110 active:scale-95 transition-all"
          aria-label="Image Alchemist Lab"
        >
          ✨
        </button>
      )}

      {/* Navigation for small screens / install reminder footer if needed */}
      <footer className="py-8 text-center bg-gray-50/50 border-t border-gray-100">
         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
           VocabMaster PWA • 2025 Edition
         </p>
      </footer>
    </div>
  );
};

export default App;
