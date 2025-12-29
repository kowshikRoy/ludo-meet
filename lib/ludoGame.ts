
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
// Red starts at 0 (arbitrary choice, relative to board)
const START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

export function createInitialState(): GameState {
  const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
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

export function movePiece(gameState: GameState, pieceId: string, diceValue: number): GameState {
  const newState = JSON.parse(JSON.stringify(gameState));
  const player = newState.players[newState.currentPlayerIndex];
  const piece = player.pieces.find((p: Piece) => p.id === pieceId);

  if (!piece) return gameState;

  if (piece.state === 'home' && diceValue === 6) {
    piece.state = 'active';
    piece.distanceTraveled = 0;
    piece.position = START_POSITIONS[piece.color as PlayerColor];
    // Note: Check for collisions immediately handled?
  } else if (piece.state === 'active') {
    if (piece.distanceTraveled + diceValue < TOTAL_LENGTH) {
      piece.distanceTraveled += diceValue;
      // Update position on main board (0-51)
      // If piece is in home stretch, position handling might need care
      // We'll simplify position for UI: standard path is % 52
      // Home stretch is virtual
      if (piece.distanceTraveled < 51) { // 51 is last shared square? Actually path is 52 steps.
        // Wait, 0 to 51 is 52 steps. 
        // If START is 0. 
        // 0 -> 50 is 51 steps?
        piece.position = (START_POSITIONS[piece.color as PlayerColor] + piece.distanceTraveled) % 52;
      } else {
        // In home stretch
        // We don't map to 0-52 loop anymore
      }
    } else if (piece.distanceTraveled + diceValue === TOTAL_LENGTH - 1) { // Ludo usually ends at center
      piece.distanceTraveled += diceValue;
      piece.state = 'finished';
    }
  }

  // Capture Logic (simplified)
  // If landed on opponent piece in shared path (not safe zones)
  // ...

  // Next turn logic
  if (diceValue !== 6) {
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % 4;
  }
  newState.waitingForMove = false;
  newState.diceValue = null;

  return newState;
}
