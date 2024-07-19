import { Token } from "../types";
import { Board } from "../classes/board";


export const checkWin = (board: Board[][]): Token | null => {
    const dimension = board.length;

    // Helper function to get the winner of a board or null if no winner
    const getBoardWinner = (board: Board): Token | null => board.winner;

    // Check rows
    for (let row = 0; row < dimension; row++) {
        const firstCellWinner = getBoardWinner(board[row][0]);
        if (firstCellWinner && board[row].every(cell => getBoardWinner(cell) === firstCellWinner)) {
            return firstCellWinner;
        }
    }

    // Check columns
    for (let col = 0; col < dimension; col++) {
        const firstCellWinner = getBoardWinner(board[0][col]);
        if (firstCellWinner && board.every(row => getBoardWinner(row[col]) === firstCellWinner)) {
            return firstCellWinner;
        }
    }

    // Check diagonals
    const firstDiagonalWinner = getBoardWinner(board[0][0]);
    if (firstDiagonalWinner && board.every((row, idx) => getBoardWinner(row[idx]) === firstDiagonalWinner)) {
        return firstDiagonalWinner;
    }

    const secondDiagonalWinner = getBoardWinner(board[0][dimension - 1]);
    if (secondDiagonalWinner && board.every((row, idx) => getBoardWinner(row[dimension - 1 - idx]) === secondDiagonalWinner)) {
        return secondDiagonalWinner;
    }

    return null;
};

// export const checkDraw = (board: Board[][]): boolean => {
//     return board.every(row => row.every(cell => cell !== null)) && checkWin(board) === null;
// };

// export const checkLargerDraw = (board: Board[][]): boolean => {
//     return board.every(row => row.every(cell => cell.winner !== null)) && checkWin(board) === null;
// };

export const unSet = (board: Board[][], position:{row: number, col:number}) => {
    const { row, col } = position;

    board[row][col] = new Board(3)
}