import { Token } from "../types"

export class Board {

    static createEmptyBoard(dimension: number) {
        const board = Array(dimension)
        for (let i = 0; i < dimension; i++) {
            board[i] = Array(dimension).fill(null)
        }

        return board
    }

    public dimension:number
    public matrix:(Token | null)[][]
    public winner:(Token | null)

    constructor(dimension:number) {
        this.dimension = dimension
        this.matrix = Board.createEmptyBoard(dimension)
        this.winner = null
    }

    public set(token:Token | null, position:{row: number, col:number}) {
        const { row, col } = position;

        if (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension) {
            throw new Error("Position out of bounds");
        }
        if (this.matrix[row][col] !== null) {
            throw new Error("Position already occupied");
        }

        this.matrix[row][col] = token
    }

    public unSet(token: null, position:{row: number, col:number}) {
        const { row, col } = position;

        this.matrix[row][col] = token
    }

    public checkWin = (): Token | null => {
        const dimension = this.matrix.length;
        
        if (this.winner) {
            return null
        }

        for (let row = 0; row < dimension; row++) {
            if (this.matrix[row][0] && this.matrix[row].every(cell => cell === this.matrix[row][0])) {
                return this.matrix[row][0];
            }
        }
    
        for (let col = 0; col < dimension; col++) {
            if (this.matrix[0][col] && this.matrix.every(row => row[col] === this.matrix[0][col])) {
                return this.matrix[0][col];
            }
        }
    
        // Check diagonals
        if (this.matrix[0][0] && this.matrix.every((row, idx) => row[idx] === this.matrix[0][0])) {
            return this.matrix[0][0];
        }
    
        if (this.matrix[0][dimension - 1] && this.matrix.every((row, idx) => row[dimension - 1 - idx] === this.matrix[0][dimension - 1])) {
            return this.matrix[0][dimension - 1];
        }
    
        return null;
    }

    public getWinner = () => {
        return this.winner
    }

    public setWinner = (token: Token) => {
        this.winner = token
    }

    public setCompletedBoard = (token: Token) => {
        const winningBoard = new Board(1)

        winningBoard.matrix[0][0] = token
        winningBoard.winner = token

        return winningBoard
    }
    
    public checkDraw = (): boolean => {
        return this.matrix.every(row => row.every(cell => cell !== null)) && this.checkWin() === null;
    };
}
