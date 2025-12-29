'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Piece, GameState, createInitialState, rollDice, movePiece, PlayerColor, canMovePiece } from '@/lib/ludoGame';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getPieceCoordinates, MAIN_PATH_COORDS } from '@/lib/boardMapping';
import LudoPiece from '@/components/LudoPiece';

// Helper for highlighting safe zones or special cells if needed
const SAFE_ZONES: { x: number, y: number }[] = [
  { x: 6, y: 1 }, { x: 8, y: 13 }, { x: 1, y: 8 }, { x: 13, y: 6 }
];

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
        <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-slate-100 border-4 border-slate-800 shadow-2xl rounded-lg overflow-hidden grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)]">

          {/* Background Grid - Rendered explicitly for debug/structure */}
          {Array.from({ length: 15 * 15 }).map((_, i) => {
            const x = i % 15;
            const y = Math.floor(i / 15);
            // Check if this cell is part of the path
            const isPath = MAIN_PATH_COORDS.some(c => c.x === x && c.y === y);

            return (
              <div
                key={i}
                className={cn(
                  "border border-slate-200/50",
                  isPath ? "bg-white" : "bg-transparent"
                )}
              />
            );
          })}

          {/* Bases and Home Areas (Absolute positioned for now, or we can use grid-area if we wanted) */}
          {/* We'll stick to absolute Overlays for the big blocks, z-index 0 */}
          <div className="absolute inset-0 grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)] pointer-events-none z-0">
            {/* Red Base (Top Left) */}
            <div className="col-span-6 row-span-6 bg-red-100 border-r-2 border-b-2 border-slate-300 p-4">
              <div className="w-full h-full bg-red-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold opacity-50">RED</span>
              </div>
            </div>
            {/* Green Base (Top Right) */}
            <div className="col-start-10 col-span-6 row-span-6 bg-green-100 border-l-2 border-b-2 border-slate-300 p-4">
              <div className="w-full h-full bg-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold opacity-50">GREEN</span>
              </div>
            </div>
            {/* Blue Base (Bottom Right) */}
            <div className="col-start-10 col-span-6 row-start-10 row-span-6 bg-blue-100 border-l-2 border-t-2 border-slate-300 p-4">
              <div className="w-full h-full bg-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold opacity-50">BLUE</span>
              </div>
            </div>
            {/* Yellow Base (Bottom Left) */}
            <div className="col-span-6 row-start-10 row-span-6 bg-yellow-100 border-r-2 border-t-2 border-slate-300 p-4">
              <div className="w-full h-full bg-yellow-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold opacity-50">YELLOW</span>
              </div>
            </div>

            {/* Center Home */}
            <div className="col-start-7 col-span-3 row-start-7 row-span-3 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/20 to-blue-500/20"></div>
            </div>
          </div>

          {/* Pieces */}
          {/* Ensure z-index is higher than background */}
          <div className="absolute inset-0 grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)] pointer-events-none z-10 w-full h-full">
            {gameState.players.map((player, pIndex) => (
              player.pieces.map((piece, i) => {
                          const pIdx = parseInt(piece.id.split('-')[1]);
                          const coords = getPieceCoordinates(piece.color, piece.position, piece.state, pIdx);

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

          {gameState.waitingForMove && (
            <div className="text-sm text-slate-500 animate-pulse">
              Select a piece to move...
            </div>
          )}
        </div>
      </div>
    );
}
