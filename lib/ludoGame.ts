
export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type PieceState = 'home' | 'active' | 'finished';

export interface Piece {
  id: string;
  color: PlayerColor;
  state: PieceState;
  position: number; // 0-51 for main path, plus refined handling for home column
  distanceTraveled: number; // 0 to 57 (51 + 6 for home stretch)
}

export interface Player {
  color: PlayerColor;
  pieces: Piece[];
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number; // 0-3
  diceValue: number | null;
  waitingForMove: boolean;
  winner: PlayerColor | null;
}

export const PATH_LENGTH = 52;
export const HOME_STRETCH_LENGTH = 6;
export const TOTAL_LENGTH = PATH_LENGTH + HOME_STRETCH_LENGTH;

// Starting positions on the main path for each color (0-51)
// Blue starts at 0 (Left Wing)
const START_POSITIONS: Record<PlayerColor, number> = {
  blue: 0,
  yellow: 13,
  green: 26,
  red: 39
};

export function createInitialState(): GameState {
  const colors: PlayerColor[] = ['blue', 'yellow', 'green', 'red']; // Clockwise turn order
  return {
    players: colors.map(color => ({
      color,
      pieces: Array.from({ length: 4 }, (_, i) => ({
        id: `${color}-${i}`,
        color,
        state: 'home',
        position: -1,
        distanceTraveled: 0
      }))
    })),
    currentPlayerIndex: 0,
    diceValue: null,
    waitingForMove: false,
    winner: null
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function canMovePiece(piece: Piece, diceValue: number): boolean {
  if (piece.state === 'finished') return false;
  if (piece.state === 'home') return diceValue === 6;
  // active
  return piece.distanceTraveled + diceValue < TOTAL_LENGTH; // Must land exactly or within limit? Usually exact for final
}

// Safe indices on the main path (0-51)
// Starts: 0 (Blue), 13 (Yellow), 26 (Green), 39 (Red)
// Stars: 8, 21, 34, 47 (8 steps from start)
const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export function movePiece(gameState: GameState, pieceId: string, diceValue: number): GameState {
  // Legacy wrapper for instant move (if needed) or we can just replace usage.
  // For now, let's keep it but maybe unused if we switch to animation?
  // Actually, let's rewrite it to show how it composes, or just leave it for tests/fallback.
  // ...
  // Let's just create the new functions and use them in the UI.
  let newState = JSON.parse(JSON.stringify(gameState));
  const player = newState.players[newState.currentPlayerIndex];
  const piece = player.pieces.find((p: Piece) => p.id === pieceId);

  if (!piece) return gameState;

  if (piece.state === 'home') {
    if (diceValue === 6) {
      newState = activatePiece(newState, pieceId);
    }
  } else {
    // Move full distance
    for (let i = 0; i < diceValue; i++) {
      newState = advancePieceByOne(newState, pieceId);
      // If finished, stop?
      const updatedPiece = newState.players[newState.currentPlayerIndex].pieces.find((p: Piece) => p.id === pieceId);
      if (updatedPiece.state === 'finished') break;
    }
  }

  return finalizeTurn(newState, pieceId, diceValue);
}

export function activatePiece(gameState: GameState, pieceId: string): GameState {
  const newState = JSON.parse(JSON.stringify(gameState));
  const player = newState.players[newState.currentPlayerIndex];
  const piece = player.pieces.find((p: Piece) => p.id === pieceId);

  if (piece && piece.state === 'home') {
    piece.state = 'active';
    piece.distanceTraveled = 0;
    piece.position = START_POSITIONS[piece.color as PlayerColor];
  }
  return newState;
}

export function advancePieceByOne(gameState: GameState, pieceId: string): GameState {
  const newState = JSON.parse(JSON.stringify(gameState));
  const player = newState.players[newState.currentPlayerIndex];
  const piece = player.pieces.find((p: Piece) => p.id === pieceId);

  if (piece && piece.state === 'active') {
    piece.distanceTraveled += 1;
    if (piece.distanceTraveled < 51) {
      piece.position = (START_POSITIONS[piece.color as PlayerColor] + piece.distanceTraveled) % 52;
    } else {
      // In home stretch
      // Use offset 100 to differentiate from main path (0-51)
      piece.position = 100 + (piece.distanceTraveled - 51);

      if (piece.distanceTraveled >= TOTAL_LENGTH - 1) { // 57
        // Reached end?
        if (piece.distanceTraveled === TOTAL_LENGTH - 1) { // Ludo usually ends at center
          piece.state = 'finished';
        }
      }
    }
  }
  return newState;
}

export function finalizeTurn(gameState: GameState, pieceId: string, diceValue: number): GameState {
  const newState = JSON.parse(JSON.stringify(gameState));
  const player = newState.players[newState.currentPlayerIndex];
  const piece = player.pieces.find((p: Piece) => p.id === pieceId);

  // Capture Logic
  if (piece && piece.state === 'active' && piece.distanceTraveled < 51) {
    const landedPosition = piece.position;
    const isSafe = SAFE_INDICES.includes(landedPosition);

    if (!isSafe) {
      newState.players.forEach((otherPlayer: Player) => {
        if (otherPlayer.color !== piece.color) {
          otherPlayer.pieces.forEach((otherPiece: Piece) => {
            if (otherPiece.state === 'active' && otherPiece.position === landedPosition && otherPiece.distanceTraveled < 52) {
              // Capture!
              otherPiece.state = 'home';
              otherPiece.position = -1;
              otherPiece.distanceTraveled = 0;
              // console.log(`Captured ${otherPiece.id} by ${piece.id}`);
            }
          });
        }
      });
    }
  }

  // Turn switching
  if (diceValue !== 6) {
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % 4;
  }

  newState.waitingForMove = false;
  newState.diceValue = null;

  return newState;
}
