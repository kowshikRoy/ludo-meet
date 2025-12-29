
import { createInitialState, rollDice, canMovePiece, movePiece, GameState, PlayerColor, TOTAL_LENGTH } from '../lib/ludoGame';

// Polyfill for simulation if needed (though we use pure logic imports)
// We need to suppress console logs to keep output clean, or redirect them.

function simulateGame() {
    console.log('Starting Ludo Game Simulation...');
    let state = createInitialState();
    let turnCount = 0;
    const maxTurns = 10000; // Prevention against infinite loops

    while (turnCount < maxTurns) {
        turnCount++;
        const currentPlayer = state.players[state.currentPlayerIndex];
        const diceOfTurn = rollDice();

        // Check for winner
        const winner = checkWinner(state);
        if (winner) {
            console.log(`\n🎉 GAME OVER! Winner: ${winner}`);
            console.log(`Total Turns: ${turnCount}`);
            return true;
        }

        // Filter movable pieces
        const movablePieces = currentPlayer.pieces.filter(p => canMovePiece(p, diceOfTurn));

        if (movablePieces.length > 0) {
            // Simple AI: Prioritize capturing > moving active > starting new
            // For now, random valid move is fine to test robustness
            const pieceToMove = movablePieces[Math.floor(Math.random() * movablePieces.length)];
            state = movePiece(state, pieceToMove.id, diceOfTurn);
            // console.log(`Turn ${turnCount}: ${currentPlayer.color} rolled ${diceOfTurn} and moved ${pieceToMove.id}. Dist: ${pieceToMove.distanceTraveled}/${TOTAL_LENGTH}`);
        } else {
            // Skip turn (logic handled inside movePiece? No, movePiece handles the MOVE. Turn switch happens if no move?)
            // Wait, UI handles skipping. We need to manually switch turn if no move possible.
            // In `lib/ludoGame.ts`, `finalizeTurn` switches turn.
            // But if we CANNOT move, we don't call `movePiece`.
            // We need to implement the "pass" logic here identical to UI.

            // Only switch turn if not 6. If 6 and no move possible (impossible if pieces in home?), player gets another roll?
            // Rules: 6 gives another roll. If you can't move, you usually pass the dice?
            // If you have all pieces home, and roll 1-5, you can't move. Turn passes.
            // If you roll 6, you can't move if all active pieces are blocked? (Unlikely).
            // Actually, if you roll 6, you get another turn. If you can't move any piece, you still get another turn?
            // Usually, if you can't move, pass.

            // Replicating "Switch Turn" logic if no move:
            if (diceOfTurn !== 6) {
                state.currentPlayerIndex = (state.currentPlayerIndex + 1) % 4;
            }
            // console.log(`Turn ${turnCount}: ${currentPlayer.color} rolled ${diceOfTurn} - No moves.`);
        }
    }

    console.error('Simulation timed out! Possible infinite loop or logic error.');
    return false;
}

function checkWinner(state: GameState): PlayerColor | null {
    for (const player of state.players) {
        if (player.pieces.every(p => p.state === 'finished')) {
            return player.color;
        }
    }
    return null;
}

if (simulateGame()) {
    console.log('Simulation passed!');
    process.exit(0);
} else {
    console.error('Simulation failed!');
    process.exit(1);
}
