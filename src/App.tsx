import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden font-sans static-bg scanlines selection:bg-[#FF00FF]/50 selection:text-[#00FFFF]">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10 border-b-4 border-[#00FFFF] bg-black/80">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#FF00FF] text-black tear-box">
            <Terminal size={32} />
          </div>
          <h1 className="text-2xl md:text-4xl font-mono font-bold uppercase tracking-widest glitch-text">
            SYS.OVERRIDE
            <span aria-hidden="true">SYS.OVERRIDE</span>
            <span aria-hidden="true">SYS.OVERRIDE</span>
          </h1>
        </div>
        <div className="text-right border-l-4 border-[#FF00FF] pl-4">
          <p className="text-sm md:text-xl text-[#00FFFF] font-mono mb-1 uppercase">MAX_FRAGMENTS</p>
          <p className="text-2xl md:text-3xl font-bold text-[#FF00FF] font-mono glitch-text">
            {highScore.toString().padStart(4, '0')}
            <span aria-hidden="true">{highScore.toString().padStart(4, '0')}</span>
            <span aria-hidden="true">{highScore.toString().padStart(4, '0')}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 gap-8">
        <SnakeGame onScoreChange={handleScoreChange} />
      </main>

      {/* Footer / Music Player */}
      <footer className="w-full p-6 flex justify-center z-10 border-t-4 border-[#00FFFF] bg-black/80">
        <MusicPlayer />
      </footer>
    </div>
  );
}
