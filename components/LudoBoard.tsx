'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Piece, GameState, createInitialState, rollDice, movePiece, PlayerColor, canMovePiece, activatePiece, advancePieceByOne, finalizeTurn } from '@/lib/ludoGame';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceCoordinates, MAIN_PATH_COORDS, HOME_RUN_COORDS, SAFE_ZONES } from '@/lib/boardMapping';
import LudoPiece from '@/components/LudoPiece';

// Helper for highlighting safe zones or special cells if needed

const DiceFace = ({ value, isRolling }: { value: number, isRolling?: boolean }) => {
  // Standard dice layout using 100x100 coord system
  // Dots radius = 13 (approx 26% of width)
  const Dots = () => {
    switch (value) {
      case 1:
        return <circle cx="50" cy="50" r="16" fill="currentColor" />;
      case 2:
        return (
          <>
            <circle cx="25" cy="25" r="13" fill="currentColor" />
            <circle cx="75" cy="75" r="13" fill="currentColor" />
          </>
        );
      case 3:
        return (
          <>
            <circle cx="20" cy="20" r="13" fill="currentColor" />
            <circle cx="50" cy="50" r="13" fill="currentColor" />
            <circle cx="80" cy="80" r="13" fill="currentColor" />
          </>
        );
      case 4:
        return (
          <>
            <circle cx="25" cy="25" r="13" fill="currentColor" />
            <circle cx="75" cy="25" r="13" fill="currentColor" />
            <circle cx="25" cy="75" r="13" fill="currentColor" />
            <circle cx="75" cy="75" r="13" fill="currentColor" />
          </>
        );
      case 5:
        return (
          <>
            <circle cx="25" cy="25" r="13" fill="currentColor" />
            <circle cx="75" cy="25" r="13" fill="currentColor" />
            <circle cx="25" cy="75" r="13" fill="currentColor" />
            <circle cx="75" cy="75" r="13" fill="currentColor" />
            <circle cx="50" cy="50" r="13" fill="currentColor" />
          </>
        );
      case 6:
        return (
          <>
            <circle cx="25" cy="20" r="13" fill="currentColor" />
            <circle cx="25" cy="50" r="13" fill="currentColor" />
            <circle cx="25" cy="80" r="13" fill="currentColor" />
            <circle cx="75" cy="20" r="13" fill="currentColor" />
            <circle cx="75" cy="50" r="13" fill="currentColor" />
            <circle cx="75" cy="80" r="13" fill="currentColor" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full h-full flex items-center justify-center", isRolling && "animate-spin-fast")}>
      <svg viewBox="0 0 100 100" className="w-[70px] h-[70px] text-black fill-current">
        <Dots />
      </svg>
    </div>
  );
};

const Dice3D = ({ isRolling }: { isRolling: boolean }) => {
  // Button is w-24 (96px). 3D dice size 70px seems good (clean padding).
  // Half size for translateZ is 35px.
  const size = 70;
  const half = size / 2;

  // Dot helper - default size w-5 h-5 (20px) which matches r=13 (26px diam) roughly? 
  // Wait, r=13 => diam 26 units. 26% of 70px = 18.2px.
  // w-4.5 is 1.125rem = 18px.
  // w-5 is 1.25rem = 20px.
  // Let's go w-4.5 (18px) to be safe or w-5 (20px) for boldness.
  // User wants BIG dots. Let's do w-5 (20px).
  const Dot = ({ top, left, size = "w-5 h-5" }: { top: number, left: number, size?: string }) => (
    <div
      className={cn("absolute bg-black rounded-full -translate-x-1/2 -translate-y-1/2", size)}
      style={{ top: `${top}%`, left: `${left}%` }}
    />
  );

  return (
    <div className="relative" style={{ width: size, height: size, perspective: '300px' }}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={isRolling ? {
          rotateX: [0, 360, 720, 1080],
          rotateY: [0, 360, 720, 1080],
          rotateZ: [0, 180, 360]
        } : {
          rotateX: -20,
          rotateY: 30
        }}
        transition={isRolling ? {
          duration: 0.6,
          ease: "linear",
          repeat: Infinity
        } : {
          duration: 0.5
        }}
      >
        {/* Faces - Using consistent layouts */}
        {/* Front (1) - Ace is larger */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 backface-hidden" style={{ transform: `translateZ(${half}px)` }}>
          <Dot top={50} left={50} size="w-6 h-6" />
        </div>

        {/* Back (6) */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 backface-hidden" style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}>
          <Dot top={20} left={25} />
          <Dot top={50} left={25} />
          <Dot top={80} left={25} />
          <Dot top={20} left={75} />
          <Dot top={50} left={75} />
          <Dot top={80} left={75} />
        </div>

        {/* Top (2) */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 backface-hidden" style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}>
          <Dot top={25} left={25} />
          <Dot top={75} left={75} />
        </div>

        {/* Bottom (5) */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 backface-hidden" style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}>
          <Dot top={25} left={25} />
          <Dot top={25} left={75} />
          <Dot top={75} left={25} />
          <Dot top={75} left={75} />
          <Dot top={50} left={50} />
        </div>

        {/* Right (3) */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 backface-hidden" style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}>
          <Dot top={20} left={20} />
          <Dot top={50} left={50} />
          <Dot top={80} left={80} />
        </div>

        {/* Left (4) */}
        <div className="absolute inset-0 bg-white border-2 border-slate-300 backface-hidden" style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}>
          <Dot top={25} left={25} />
          <Dot top={25} left={75} />
          <Dot top={75} left={25} />
          <Dot top={75} left={75} />
        </div>
      </motion.div>
    </div>
  );
};

export default function LudoBoard() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  // Dice sound/animation could go here

  // We need to keep a ref or state for "isAnimating" to prevent interaction
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  // displayDiceValue is no longer needed if we only show 3D spin during roll and actual value after.
  // But wait, user said "finally show svg".

  const runMoveAnimation = async (piece: Piece, diceValue: number) => {
    setIsAnimating(true);

    // If piece is home, it just activates (no multi-step animation for now, though we could animate spawn)
    if (piece.state === 'home') {
      const newState = activatePiece(gameState, piece.id);
      setGameState(newState);
      // Short delay to show activation
      await new Promise(r => setTimeout(r, 400));
      const finalState = finalizeTurn(newState, piece.id, diceValue);
      setGameState(finalState);
    } else {
      // Move step by step
      let currentState = gameState;
      for (let i = 0; i < diceValue; i++) {
        currentState = advancePieceByOne(currentState, piece.id);
        setGameState(currentState);
        // Wait for step
        // Calculate delay - closer to "a bit slower"? 200ms?
        await new Promise(r => setTimeout(r, 250));

        // If finished, break
        const p = currentState.players[currentState.currentPlayerIndex].pieces.find(p => p.id === piece.id);
        if (p && p.state === 'finished') break;
      }

      // Finalize
      await new Promise(r => setTimeout(r, 200)); // Pause before capture effect
      const finalState = finalizeTurn(currentState, piece.id, diceValue);
      setGameState(finalState);
    }

    setIsAnimating(false);
  };

  const handleRollDice = async () => {
    if (gameState.waitingForMove || isAnimating || isRolling) return;

    setIsRolling(true);

    // Randomize duration
    const duration = 800;

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, duration));

    const roll = rollDice();
    setIsRolling(false);

    // Check if any move is possible
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const movablePieces = currentPlayer.pieces.filter(p => canMovePiece(p, roll));
    const hasMoves = movablePieces.length > 0;

    let nextState = { ...gameState, diceValue: roll, waitingForMove: hasMoves };

    if (!hasMoves) {
      // Auto skip turn if no moves
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentPlayerIndex: (prev.currentPlayerIndex + 1) % 4,
          diceValue: null,
          waitingForMove: false
        }));
      }, 1000);
      setGameState(nextState); // Update immediately to show dice
    } else if (movablePieces.length === 1) {
      // Auto move if only one option
      setGameState(nextState); // Show dice
      setTimeout(() => {
        runMoveAnimation(movablePieces[0], roll);
      }, 500);
    } else {
      setGameState(nextState);
    }
  };

  const handleDataPieceClick = (piece: Piece) => {
    if (!gameState.waitingForMove || !gameState.diceValue || isAnimating) return;
    if (piece.color !== gameState.players[gameState.currentPlayerIndex].color) return;

    if (canMovePiece(piece, gameState.diceValue)) {
      runMoveAnimation(piece, gameState.diceValue);
    }
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="flex flex-col items-center gap-8">
        {/* Board Container - Fixed Aspect Ratio and explicit sizing */}
      <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-white border-2 border-slate-400 shadow-2xl overflow-hidden grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)]">

        {/* Background Grid */}
          {Array.from({ length: 15 * 15 }).map((_, i) => {
            const x = i % 15;
            const y = Math.floor(i / 15);

            // Determine cell type
            const isMainPath = MAIN_PATH_COORDS.some(c => c.x === x && c.y === y);

            // Check Home Runs
            const isRedHome = HOME_RUN_COORDS.red.some(c => c.x === x && c.y === y);
            const isGreenHome = HOME_RUN_COORDS.green.some(c => c.x === x && c.y === y);
            const isYellowHome = HOME_RUN_COORDS.yellow.some(c => c.x === x && c.y === y);
            const isBlueHome = HOME_RUN_COORDS.blue.some(c => c.x === x && c.y === y);

            // Safe Zones (Stars)
            const isSafeZone = SAFE_ZONES.some(c => c.x === x && c.y === y);

            // Start Positions (For Arrows)
            const isBlueStart = x === 1 && y === 6;
            const isYellowStart = x === 8 && y === 1;
            const isGreenStart = x === 13 && y === 8;
            const isRedStart = x === 6 && y === 13;

            let bgClass = "bg-transparent";
            let borderColor = "border-slate-800";

            if (isRedHome) { bgClass = "bg-red-500"; borderColor = "border-red-600"; }
            else if (isGreenHome) { bgClass = "bg-green-500"; borderColor = "border-green-600"; }
            else if (isYellowHome) { bgClass = "bg-yellow-400"; borderColor = "border-yellow-500"; }
            else if (isBlueHome) { bgClass = "bg-blue-500"; borderColor = "border-blue-600"; }
            else if (isBlueStart) { bgClass = "bg-blue-500"; borderColor = "border-blue-600"; }
            else if (isYellowStart) { bgClass = "bg-yellow-400"; borderColor = "border-yellow-500"; }
            else if (isGreenStart) { bgClass = "bg-green-500"; borderColor = "border-green-600"; }
            else if (isRedStart) { bgClass = "bg-red-500"; borderColor = "border-red-600"; }
            else if (isMainPath) bgClass = "bg-white";

            return (
              <div
                key={i}
                className={cn(
                  "border-[0.5px] border-slate-800 flex items-center justify-center relative",
                  bgClass
                )}
              >
                {/* Visual Markers */}
                {isSafeZone && !isBlueStart && !isYellowStart && !isGreenStart && !isRedStart && (
                  <span className="text-slate-400 text-[10px] sm:text-lg">★</span>
                )}
                {/* Arrows for Starts */}
                {isBlueStart && <span className="text-white text-lg font-bold">➜</span>}
                {isYellowStart && <span className="text-white text-lg font-bold rotate-90">➜</span>}
                {isGreenStart && <span className="text-white text-lg font-bold rotate-180">➜</span>}
                {isRedStart && <span className="text-white text-lg font-bold -rotate-90">➜</span>}
              </div>
            );
          })}

        {/* Bases */}
          <div className="absolute inset-0 grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)] pointer-events-none z-0">
          {/* Blue Base (Top Left) */}
          <div className="col-span-6 row-span-6 bg-blue-500 p-4 sm:p-6 border border-slate-800">
            <div className="w-full h-full bg-white rounded-xl shadow-inner"></div>
          </div>

          {/* Yellow Base (Top Right) */}
          <div className="col-start-10 col-span-6 row-span-6 bg-yellow-400 p-4 sm:p-6 border border-slate-800">
            <div className="w-full h-full bg-white rounded-xl shadow-inner"></div>
            </div>

          {/* Green Base (Bottom Right) */}
          <div className="col-start-10 col-span-6 row-start-10 row-span-6 bg-green-500 p-4 sm:p-6 border border-slate-800">
            <div className="w-full h-full bg-white rounded-xl shadow-inner"></div>
          </div>

          {/* Red Base (Bottom Left) */}
          <div className="col-span-6 row-start-10 row-span-6 bg-red-500 p-4 sm:p-6 border border-slate-800">
            <div className="w-full h-full bg-white rounded-xl shadow-inner"></div>
            </div>

            {/* Center Home */}
          <div className="col-start-7 col-span-3 row-start-7 row-span-3 bg-white flex items-center justify-center relative overflow-hidden board-center border border-slate-800">
            <div className="absolute inset-0 w-full h-full">
              {/* Blue (Left) */}
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}></div>
              {/* Yellow (Top) */}
              <div className="absolute top-0 left-0 w-full h-full bg-yellow-400" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }}></div>
              {/* Green (Right) */}
              <div className="absolute top-0 left-0 w-full h-full bg-green-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}></div>
              {/* Red (Bottom) */}
              <div className="absolute top-0 left-0 w-full h-full bg-red-500" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)' }}></div>
            </div>
            </div>
          </div>

        {/* Pieces */}
          <div className="absolute inset-0 grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)] pointer-events-none z-10 w-full h-full">
            {gameState.players.map((player, pIndex) => (
              player.pieces.map((piece, i) => {
                          const pIdx = parseInt(piece.id.split('-')[1]);
                          const coords = getPieceCoordinates(piece.color, piece.position, piece.state, pIdx);

                // Improve clickability check
                          const isCurrentTurn = gameState.currentPlayerIndex === pIndex;
                          const isMovable = isCurrentTurn && gameState.diceValue !== null && canMovePiece(piece, gameState.diceValue);

                          return (
                               <div key={piece.id} className="contents pointer-events-auto">
                                 <LudoPiece
                                   color={piece.color}
                                   x={coords.x}
                                   y={coords.y}
                                   isClickable={isMovable}
                                   onClick={() => handleDataPieceClick(piece)}
                                 />
                               </div>
                          );
                        })
                    ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "text-2xl font-bold uppercase tracking-wider px-6 py-2 rounded-full transition-colors",
            currentPlayer.color === 'red' && "bg-red-100 text-red-700",
            currentPlayer.color === 'green' && "bg-green-100 text-green-700",
            currentPlayer.color === 'yellow' && "bg-yellow-100 text-yellow-700",
            currentPlayer.color === 'blue' && "bg-blue-100 text-blue-700",
          )}>
            {currentPlayer.color}'s Turn
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handleRollDice}
            disabled={(gameState.waitingForMove && !isRolling) || !!gameState.winner}
              className={cn(
                "w-24 h-24 rounded-2xl text-4xl font-black shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 p-0 overflow-visible [&_svg]:size-auto",
                "bg-white text-black border-2 border-slate-200"
              )}
            >
            {isRolling || !gameState.diceValue ? (
              <Dice3D isRolling={isRolling} />
            ) : (
              <DiceFace value={gameState.diceValue} />
            )}
            </Button>
          </div>

        <div className="h-5 text-sm text-slate-500 animate-pulse font-medium">
          {(gameState.waitingForMove && !isRolling) ? "Select a piece to move..." : ""}
        </div>
        </div>
      </div>
    );
}
