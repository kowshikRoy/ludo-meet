import { PlayerColor } from './ludoGame';

export const CELL_SIZE = 100 / 15; // in percentage

interface Coordinate {
    x: number; // 0-14 column
    y: number; // 0-14 row
}

// Define the global path (52 steps)
// Starting from Red's start position (index 0)
// Red is TL, Green TR, Yellow BR, Blue BL (Standard Clockwise)
// Actually standard Ludo:
// TL Red, TR Green, BR Blue, BL Yellow is also common.
// Let's stick to: 
// Red (TL) -> Green (TR) -> Yellow (BR) -> Blue (BL) 
// (Note: Order matters for turn sequence) -> Red, Green, Yellow, Blue.

// Let's define the path coordinates explicitly
// Define the global path (52 steps)
// Blue (TL) -> Yellow (TR) -> Green (BR) -> Red (BL)
// Each quarter is 13 steps: 5 (Straight) + 5 (Straight) + 3 (Corner Turn)
export const MAIN_PATH_COORDS: Coordinate[] = [
    // Q1: Blue Section
    { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, // 5 Right
    { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, // 5 Up
    { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, // 3 Turn (Corner, Middle, Corner)

    // Q2: Yellow Section
    { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, // 5 Down
    { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, // 5 Right
    { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, // 3 Turn

    // Q3: Green Section
    { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 }, // 5 Left
    { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, // 5 Down
    { x: 8, y: 14 }, { x: 7, y: 14 }, { x: 6, y: 14 }, // 3 Turn

    // Q4: Red Section
    { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 }, // 5 Up
    { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, // 5 Left
    { x: 0, y: 8 }, { x: 0, y: 7 }, { x: 0, y: 6 } // 3 Turn
];

// Directions based on new layout:
// Blue (TL) -> Start (1,6) -> Right -> Top Wing
// Yellow (TR) -> Start (8,1) -> Down -> Right Wing
// Green (BR) -> Start (13,8) -> Left -> Bottom Wing
// Red (BL) -> Start (6,13) -> Up -> Left Wing

// Home Runs (6 squares ending in center)
export const HOME_RUN_COORDS: Record<PlayerColor, Coordinate[]> = {
    blue: [ // From Left
        { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }
    ],
    yellow: [ // From Top
        { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }
    ],
    green: [ // From Right
        { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }
    ],
    red: [ // From Bottom
        { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }
    ]
};

// Base positions (4 pieces per base)
// Blue: TL, Yellow: TR, Green: BR, Red: BL
export const BASE_POSITIONS: Record<PlayerColor, Coordinate[]> = {
    blue: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 4 }, { x: 4, y: 4 }],   // TL
    yellow: [{ x: 10, y: 1 }, { x: 13, y: 1 }, { x: 10, y: 4 }, { x: 13, y: 4 }], // TR
    green: [{ x: 10, y: 10 }, { x: 13, y: 10 }, { x: 10, y: 13 }, { x: 13, y: 13 }], // BR (Note: x>=10, y>=10)
    red: [{ x: 1, y: 10 }, { x: 4, y: 10 }, { x: 1, y: 13 }, { x: 4, y: 13 }]    // BL
};

// Safe Zones (Stars)
// Start positions imply safety + 1 star in each wing
export const SAFE_ZONES: Coordinate[] = [
    // Starts
    { x: 1, y: 6 },  // Blue Start
    { x: 8, y: 1 },  // Yellow Start
    { x: 13, y: 8 }, // Green Start
    { x: 6, y: 13 }, // Red Start
    // Stars
    { x: 8, y: 12 }, // Bottom Wing Star (Red's path, but near Green start?) NO.
    // Standard: Star is 8 steps from start.
    { x: 6, y: 2 },  // Top Wing Star (Yellow path, index 8)
    { x: 12, y: 6 }, // Right Wing Star (Green path, index 21)
    { x: 8, y: 12 }, // Bottom Wing Star (Red path, index 34)
    { x: 2, y: 8 },  // Left Wing Star (Blue path, index 47)
];


export function getPieceCoordinates(color: PlayerColor, position: number, state: 'home' | 'active' | 'finished', pieceIndex: number): Coordinate {
    if (state === 'home') {
        return BASE_POSITIONS[color][pieceIndex];
    }
    
    if (state === 'finished') {
        // Center area - slightly offset by color to show multiple finishers?
        // Or just pile them in center
        return { x: 7, y: 7 }; 
    }

    // Home stretch (Offset 100)
    if (position >= 100) {
        const homeIndex = position - 100;
        if (homeIndex >= 0 && homeIndex < 6) {
            return HOME_RUN_COORDS[color][homeIndex];
        }
    }

    // Active on main path
    if (position >= 0 && position < 52) {
        return MAIN_PATH_COORDS[position];
    }

    return { x: 7, y: 7 };
}
