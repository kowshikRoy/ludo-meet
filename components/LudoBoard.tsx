'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Piece, GameState, createInitialState, rollDice, movePiece, PlayerColor, canMovePiece } from '@/lib/ludoGame';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceCoordinates, MAIN_PATH_COORDS, HOME_RUN_COORDS, SAFE_ZONES } from '@/lib/boardMapping';
import LudoPiece from '@/components/LudoPiece';

// Helper for highlighting safe zones or special cells if needed

export default function LudoBoard() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  // Dice sound/animation could go here

  const handleRollDice = () => {
    if (gameState.waitingForMove) return;
    const roll = rollDice();

    // Check if any move is possible
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const hasMoves = currentPlayer.pieces.some(p => canMovePiece(p, roll));

    let nextState = { ...gameState, diceValue: roll, waitingForMove: hasMoves };

    if (!hasMoves) {
      // Auto skip turn if no moves (maybe delay for viewing)
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentPlayerIndex: (prev.currentPlayerIndex + 1) % 4,
          diceValue: null,
          waitingForMove: false
        }));
      }, 1000);
    }

    setGameState(nextState);
  };

  const handleDataPieceClick = (piece: Piece) => {
    if (!gameState.waitingForMove || !gameState.diceValue) return;
    if (piece.color !== gameState.players[gameState.currentPlayerIndex].color) return;

    if (canMovePiece(piece, gameState.diceValue)) {
      const newState = movePiece(gameState, piece.id, gameState.diceValue);
      setGameState(newState);
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
              disabled={gameState.waitingForMove || !!gameState.winner}
              className={cn(
                "w-24 h-24 rounded-2xl text-4xl font-black shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100",
                "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
              )}
            >
              {gameState.diceValue ?? "🎲"}
            </Button>
          </div>

        <div className={cn(
          "text-sm text-slate-500 animate-pulse transition-opacity duration-200 h-5", // Fixed height to prevent shift
          gameState.waitingForMove ? "opacity-100" : "opacity-0"
        )}>
          Select a piece to move...
        </div>
        </div>
      </div>
    );
}
