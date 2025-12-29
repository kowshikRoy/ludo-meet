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
export const MAIN_PATH_COORDS: Coordinate[] = [
    // Red Start (6, 1) going Right? 
    // Wait, Red start is usually (6, 1).
    { x: 1, y: 6 }, // 0: Red Start
    { x: 2, y: 6 },
    { x: 3, y: 6 },
    { x: 4, y: 6 },
    { x: 5, y: 6 }, // 4
    // Turn Up
    { x: 6, y: 5 }, // 5
    { x: 6, y: 4 },
    { x: 6, y: 3 },
    { x: 6, y: 2 },
    { x: 6, y: 1 },
    { x: 6, y: 0 }, // 10
    // Turn Right
    { x: 7, y: 0 }, // 11
    { x: 8, y: 0 }, // 12
    // Turn Down
    { x: 8, y: 1 }, // 13: Green Start?
    { x: 8, y: 2 },
    { x: 8, y: 3 },
    { x: 8, y: 4 },
    { x: 8, y: 5 },
    { x: 8, y: 6 }, // 18
    // Turn Right
    { x: 9, y: 6 }, // 19
    { x: 10, y: 6 },
    { x: 11, y: 6 },
    { x: 12, y: 6 },
    { x: 13, y: 6 },
    { x: 14, y: 6 }, // 24
    // Turn Down
    { x: 14, y: 7 }, // 25
    { x: 14, y: 8 }, // 26: Yellow Start (if Yellow is BR but Start is usually Top of arm? No)
    // Actually if Yellow is BR, start is (13, 8) going Left?
    // Let's trace standard path:
    // Red (6,1)-(6,5) -> (6,5)-(6,0) -> (7,0)-(8,0) -> ...
    // ...
    // Turn Left (from 14,8)
    { x: 13, y: 8 }, // 27
    { x: 12, y: 8 },
    { x: 11, y: 8 },
    { x: 10, y: 8 },
    { x: 9, y: 8 }, // 31
    // Turn Down
    { x: 8, y: 9 }, // 32
    { x: 8, y: 10 },
    { x: 8, y: 11 },
    { x: 8, y: 12 },
    { x: 8, y: 13 },
    { x: 8, y: 14 }, // 37
    // Turn Left
    { x: 7, y: 14 }, // 38
    { x: 6, y: 14 }, // 39: Blue Start?
    // Turn Up
    { x: 6, y: 13 }, // 40
    { x: 6, y: 12 },
    { x: 6, y: 11 },
    { x: 6, y: 10 },
    { x: 6, y: 9 }, // 44
    // Turn Left
    { x: 5, y: 8 }, // 45
    { x: 4, y: 8 },
    { x: 3, y: 8 },
    { x: 2, y: 8 },
    { x: 1, y: 8 }, // 49
    { x: 0, y: 8 }, // 50
    // Turn Up to close loop
    { x: 0, y: 7 }, // 51
];

// Home Runs (6 squares ending in center)
export const HOME_RUN_COORDS: Record<PlayerColor, Coordinate[]> = {
    red: [
        { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 } // Center-ish
    ],
    green: [
        { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }
    ],
    yellow: [ // If Yellow is BR
        { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }
    ],
    blue: [ // If Blue is BL
        { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }
    ]
};

// Base positions (4 pieces per base)
// Simplified: grid layouts within the base boxes
export const BASE_POSITIONS: Record<PlayerColor, Coordinate[]> = {
    red: [{x: 1, y: 1}, {x: 4, y: 1}, {x: 1, y: 4}, {x: 4, y: 4}],
    green: [{x: 10, y: 1}, {x: 13, y: 1}, {x: 10, y: 4}, {x: 13, y: 4}],
    yellow: [{x: 13, y: 13}, {x: 10, y: 13}, {x: 13, y: 10}, {x: 10, y: 10}], // BR
    blue: [{x: 1, y: 13}, {x: 4, y: 13}, {x: 1, y: 10}, {x: 4, y: 10 }] // BL
};

// Update: Wait, main path yellow/blue indices might be swapped depending on layout.
// In my MAIN_PATH_COORDS:
// Index 13 is Green Start (Correct for TR)
// Index 26 is Yellow Start? (At 14, 8) -> Checks out for TR -> BR
// Index 39 is Blue Start? (At 6, 14) -> Checks out for BR -> BL
// But BASE_POSITIONS:
// Yellow is BR (13,13).
// Blue is BL (1, 13).

export function getPieceCoordinates(color: PlayerColor, position: number, state: 'home' | 'active' | 'finished', pieceIndex: number): Coordinate {
    if (state === 'home') {
        return BASE_POSITIONS[color][pieceIndex];
    }
    
    if (state === 'finished') {
        // Center area
        return { x: 7, y: 7 }; 
    }

    // Active
    if (position < 52) {
        return MAIN_PATH_COORDS[position];
    }
    
    // Home stretch
    const homeIndex = position - 52;
    if (homeIndex >= 0 && homeIndex < 6) {
        return HOME_RUN_COORDS[color][homeIndex];
    }

    return { x: 7, y: 7 };
}
