'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Piece, GameState, createInitialState, rollDice, movePiece, PlayerColor, canMovePiece } from '@/lib/ludoGame';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to map board coordinates
// 15x15 grid
// We need to map linear positions to x,y coords

import { getPieceCoordinates } from '@/lib/boardMapping';
import LudoPiece from '@/components/LudoPiece';

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
      <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-white border-4 border-slate-800 shadow-2xl rounded-lg overflow-hidden grid grid-cols-15 grid-rows-15">
        {/* We'll implement a CSS Grid Board */}
        {/* Board Background/Layout */}
        <div className="absolute inset-0 grid grid-cols-15 grid-rows-15 pointer-events-none">
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
        {gameState.players.map((player, pIndex) => (
          player.pieces.map((piece, i) => {
            // Parse piece index from id (e.g. "red-0")
            const pIdx = parseInt(piece.id.split('-')[1]);
            const coords = getPieceCoordinates(piece.color, piece.position, piece.state, pIdx);

            const isCurrentTurn = gameState.currentPlayerIndex === pIndex;
            const isMovable = isCurrentTurn && gameState.diceValue !== null && canMovePiece(piece, gameState.diceValue);

            return (
              <LudoPiece
                key={piece.id}
                color={piece.color}
                x={coords.x}
                y={coords.y}
                isClickable={isMovable}
                onClick={() => handleDataPieceClick(piece)}
              />
            );
          })
        ))}

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

        {/* Debug State */}
        {/* <pre className="text-xs bg-slate-100 p-2 rounded">{JSON.stringify(gameState.players, null, 2)}</pre> */}
      </div>
    </div>
  );
}
