import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 300;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted || isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(100, INITIAL_SPEED - Math.floor(score / 50) * 15);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [hasStarted, isPaused, gameOver, food, score, onScoreChange, generateFood]);

  return (
    <div className="relative flex flex-col items-center tear-box">
      <div className="mb-2 flex justify-between w-full max-w-[400px] px-2 bg-black border-2 border-[#FF00FF] p-2">
        <div className="font-mono text-sm md:text-xl text-[#00FFFF] uppercase">FRAGMENTS: {score.toString().padStart(4, '0')}</div>
        <div className="font-mono text-sm md:text-xl text-[#FF00FF] uppercase glitch-text">
          {gameOver ? 'SYS_FAILURE' : isPaused ? 'SUSPENDED' : 'EXECUTING'}
          <span aria-hidden="true">{gameOver ? 'SYS_FAILURE' : isPaused ? 'SUSPENDED' : 'EXECUTING'}</span>
          <span aria-hidden="true">{gameOver ? 'SYS_FAILURE' : isPaused ? 'SUSPENDED' : 'EXECUTING'}</span>
        </div>
      </div>

      <div
        className="relative bg-black border-4 border-[#00FFFF] overflow-hidden"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#FF00FF 1px, transparent 1px), linear-gradient(90deg, #FF00FF 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute ${index === 0 ? 'bg-[#FF00FF]' : 'bg-[#00FFFF]'} border border-black`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
              width: 20,
              height: 20,
              zIndex: index === 0 ? 10 : 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-[#FF00FF] border-2 border-[#00FFFF]"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            width: 20,
            height: 20,
            animation: 'glitch 0.2s infinite'
          }}
        />

        {/* Overlays */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 border-4 border-[#FF00FF] m-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-[#00FFFF] text-black font-mono text-xl md:text-2xl uppercase hover:bg-[#FF00FF] hover:text-white transition-none cursor-pointer border-4 border-black"
            >
              &gt; INITIATE_SEQ
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#FF00FF] m-4">
            <h2 className="text-2xl md:text-4xl font-mono font-bold text-[#FF00FF] mb-2 glitch-text uppercase">
              FATAL_ERROR
              <span aria-hidden="true">FATAL_ERROR</span>
              <span aria-hidden="true">FATAL_ERROR</span>
            </h2>
            <p className="text-[#00FFFF] font-mono mb-6 text-lg md:text-xl uppercase">DATA_LOST: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-[#FF00FF] text-black font-mono text-xl md:text-2xl uppercase hover:bg-[#00FFFF] hover:text-black transition-none cursor-pointer border-4 border-black"
            >
              &gt; REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && hasStarted && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 border-4 border-[#00FFFF] m-4">
            <h2 className="text-2xl md:text-4xl font-mono font-bold text-[#00FFFF] uppercase glitch-text">
              AWAITING_INPUT
              <span aria-hidden="true">AWAITING_INPUT</span>
              <span aria-hidden="true">AWAITING_INPUT</span>
            </h2>
          </div>
        )}
      </div>

      <div className="mt-4 bg-black border-2 border-[#00FFFF] p-2 text-[#FF00FF] font-mono text-sm md:text-lg flex gap-4 uppercase w-full max-w-[400px] justify-between">
        <span>[W,A,S,D] : NAVIGATE</span>
        <span>[SPACE] : HALT</span>
      </div>
    </div>
  );
}
