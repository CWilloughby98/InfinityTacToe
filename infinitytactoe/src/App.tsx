import { useState, useEffect } from 'react';
import { Board } from './classes/board';
import { Token, Index } from './types';
import { checkWin, checkLargerDraw } from './utils';
import './App.css';

function App() {
  
  const [currentPlayer, setCurrentPlayer] = useState<Token>(Token.X);
  const [initialBoard, setInitialBoard] = useState(new Board(3));
  const [currentBoard, setCurrentBoard] = useState(initialBoard);
  const [selectingBoard, setSelectingBoard] = useState<Boolean>(false);
  const [largerBoard, setLargerBoard] = useState<Board[][] | null>(null);
  const [boardIndex, setBoardIndex] = useState<Index | null>(null)

  
  const handleClick = (boardIdx: { row: number; col: number }, cellIdx: { row: number; col: number }) => {
    if (largerBoard) {
      const { row: boardRow, col: boardCol } = boardIdx;
      const { row: cellRow, col: cellCol } = cellIdx;

      if (!selectingBoard) {
        if (currentBoard.matrix[cellRow][cellCol] === null) {
          currentBoard.set(currentPlayer, { row: cellRow, col: cellCol });
          console.log("Set Token to:", { row: cellRow, col: cellCol })
          
          const winner = currentBoard.checkWin();
          if (winner) {
            alert(`${winner} wins!`);
            updateLargerBoard(winner, boardIndex!);
          } else {
            setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
          }
        }
      } else if (selectingBoard) {
        if (!largerBoard[boardRow][boardCol].winner){
          setCurrentBoard(largerBoard[boardRow][boardCol]);
          setBoardIndex(boardIdx)
          console.log("Set Current Board to:", { row: boardRow, col: boardCol })
          setSelectingBoard(false);
        } else {
          alert(`This board is complete! ${largerBoard[boardRow][boardCol].winner} won.`)

        }
      }
    } else {
      //ONLY FOR INITIAL BOARD
      const { row, col } = cellIdx;
      if (currentBoard.matrix[row][col] === null) {
        currentBoard.set(currentPlayer, { row, col });
        setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
      }
    }
  };


  const updateLargerBoard = (winner: Token, boardIdx: { row: number; col: number }) => {
    const { row: boardRow, col: boardCol } = boardIdx;
    console.log("UpdatedBoard on Position:", boardIdx)

    currentBoard.setWinner(winner)
    const clonedCurrentBoard = currentBoard.setCompletedBoard(winner)

    const newLargerBoard = largerBoard
    newLargerBoard![boardRow][boardCol] = clonedCurrentBoard

    setLargerBoard(largerBoard);
    setCurrentPlayer(winner === Token.X ? Token.O : Token.X);
    setCurrentBoard(null!);
    setSelectingBoard(true);
  };


  const createLargerBoard = (winner: Token) => {
    const dimension = 3; // 3x3 grid of boards
    initialBoard.setWinner(winner);
    // Create a new larger board array
    const newLargerBoard = Array(dimension).fill(null).map(() => Array(dimension).fill(null).map(() => new Board(3)));

    // Clone the initial board to avoid mutating state directly
    const clonedInitialBoard = initialBoard.setCompletedBoard(winner);

    // Place the initial winning board at the center
    const center = Math.floor(dimension / 2);
    newLargerBoard[center][center] = clonedInitialBoard;

    // Update state
    setLargerBoard(newLargerBoard);
    setInitialBoard(null!);
    winner === Token.X ? setCurrentPlayer(Token.O) : setCurrentPlayer(Token.X);
    setCurrentBoard(null!);
    setSelectingBoard(true);
  };

  const create2xlBoard = (lastLargerBoard: Board[][]) => {
    const dimension = 7; // 7x7 grid of boards
    const newLargerBoard = Array(dimension)
      .fill(null)
      .map(() => Array(dimension).fill(null).map(() => new Board(3)));
  
    // Determine the center of the new larger board
    const centerStart = Math.floor(dimension / 2) - 1;

    const clonedLargeBoard = largerBoard

    newLargerBoard[centerStart][centerStart] = largerBoard

    // Update state
    setLargerBoard(newLargerBoard);
    setInitialBoard(null!);
    setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
    setCurrentBoard(null!);
    setSelectingBoard(true);
  };
  
  
  

  useEffect(() => {
    if (initialBoard) {
      const winner = currentBoard.checkWin();
      const draw = currentBoard.checkDraw();

      if (winner) {
        // Notify the user
        alert(`${winner} wins!`);
        // Create the larger board with the winning board in the center
        createLargerBoard(winner);
      } else if (draw) {
        alert(`Restarting Match`)
        setInitialBoard(new Board(3))
        setCurrentBoard(new Board(3))
      }
    } else {
      const winner = checkWin(largerBoard!)
      const draw = checkLargerDraw(largerBoard!)

      if (winner) {
        alert(`${winner} won the game!`)
      } else if (draw) {
        alert("Expanding board!")
        create2xlBoard(largerBoard!)
      }
    }
  }, [currentPlayer]);

  const isBoardEmpty = (board: Board) => {
    return board.matrix.flat().every(cell => cell === null);
  };

  // console.log('Selecting Board?', selectingBoard);
  console.log('CURRENT:', currentBoard);
  console.log("INITIAL:", initialBoard)
  // console.log('MASTER:', largerBoard);
  // console.log("BoardIndex:", boardIndex)



  return (
    <div className='h-screen flex items-center'>
      CURRENT PLAYER: {currentPlayer}
      <div className='board'>
        {currentBoard ? (
          currentBoard.matrix.map((row, rowIdx) => (
            <div className='row' key={rowIdx}>
              {row.map((cell, colIdx) => (
                <div className='cell' onClick={() => handleClick({ row: rowIdx, col: colIdx}, { row: rowIdx, col: colIdx })} key={colIdx}>
                  {cell}
                </div>
              ))}
            </div>
          ))
        ) : (
          largerBoard && largerBoard.map((boardRow, boardRowIdx) => (
            <div className='row' key={boardRowIdx}>
              {boardRow.map((board, boardColIdx) => (
                <div
                  className={`${isBoardEmpty(board) ? 'empty-board' : 'board'}`}
                  key={boardColIdx}
                >
                  {board.matrix.map((row, rowIdx) => (
                    <div className='row' key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <div
                          className={`${board.winner !== null ? 'big-cell' : 'cell'}`}
                          onClick={() => handleClick({ row: boardRowIdx, col: boardColIdx }, { row: rowIdx, col: colIdx })}
                          key={colIdx}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
