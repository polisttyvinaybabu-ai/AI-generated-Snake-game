import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Cybernetic Horizon", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://picsum.photos/seed/neon1/200/200" },
  { id: 2, title: "Neon Overdrive", artist: "Neural Net", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://picsum.photos/seed/neon2/200/200" },
  { id: 3, title: "Digital Dreams", artist: "Algo-Rhythm", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "https://picsum.photos/seed/neon3/200/200" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-blue-500/50 rounded-2xl p-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)] flex-shrink-0">
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="flex gap-1 items-end h-6">
                <div className="w-1 bg-pink-500 animate-[bounce_1s_infinite] shadow-[0_0_5px_#ec4899]" style={{ animationDelay: '0ms' }} />
                <div className="w-1 bg-pink-500 animate-[bounce_1s_infinite] shadow-[0_0_5px_#ec4899]" style={{ animationDelay: '200ms' }} />
                <div className="w-1 bg-pink-500 animate-[bounce_1s_infinite] shadow-[0_0_5px_#ec4899]" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-blue-400 font-bold truncate neon-text-blue">{track.title}</h3>
          <p className="text-gray-400 text-sm truncate font-mono">{track.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay} 
            className="p-3 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-full hover:bg-blue-500/40 transition-all neon-border-blue shadow-[0_0_10px_rgba(59,130,246,0.5)] cursor-pointer"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          <button onClick={handleNext} className="p-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div 
          className="h-1.5 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-pink-500 shadow-[0_0_10px_#ec4899]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume Control */}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-pink-400 transition-colors cursor-pointer">
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-24 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
      </div>
    </div>
  );
}
