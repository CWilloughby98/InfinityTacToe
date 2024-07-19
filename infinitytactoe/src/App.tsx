import { useState, useEffect } from 'react';
import { Board } from './classes/board';
import { Token, Index } from './types';
import { checkWin, unSet } from './utils';
import './App.css';

function App() {
  
  const [currentPlayer, setCurrentPlayer] = useState<Token>(Token.X);
  const [initialBoard, setInitialBoard] = useState(new Board(3));
  const [currentBoard, setCurrentBoard] = useState(initialBoard);
  const [selectingBoard, setSelectingBoard] = useState<Boolean>(false);
  const [largerBoard, setLargerBoard] = useState<Board[][] | null>(null);
  const [boardIndex, setBoardIndex] = useState<Index | null>(null)
  const [counterX, setCounterX] = useState<Array<Index>>([])
  const [largerBoardCounterX, setLargerBoardCounterX] = useState<Array<Index>>([])
  const [counterO, setCounterO] = useState<Array<Index>>([])
  const [largerBoardCounterO, setLargerBoardCounterO] = useState<Array<Index>>([])
  const [gameIsWon, setGameIsWon] = useState<boolean>(false)
  
  const handleClick = (boardIdx: { row: number; col: number }, cellIdx: { row: number; col: number }) => {
    if (largerBoard) {
      const { row: boardRow, col: boardCol } = boardIdx;
      const { row: cellRow, col: cellCol } = cellIdx;

      if (!selectingBoard) {
        if (currentBoard.matrix[cellRow][cellCol] === null) {
          const position = { row: cellRow, col: cellCol }

          if (currentPlayer === Token.X) {
            if (counterX.length < 3) {
              const newCounter = [...counterX, position]
  
              currentBoard.set(currentPlayer, position);
              setCounterX(newCounter)
              setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
            } else {
              currentBoard.set(currentPlayer, position);
              const winner = currentBoard.checkWin();

              if (winner) {
                // Notify the user
                alert(`HANDLE CLICK ${winner} wins!`);
                setCounterO([])
                setCounterX([])
                // Create the larger board with the winning board in the center
                updateLargerBoard(winner, boardIndex!);
                setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
              } else {
                setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
                
                const splicedCounter = counterX.splice(1, 2)
                const newCounter = [...splicedCounter, position]
                
                setCounterX(newCounter)
                currentBoard.unSet(null, counterX[0])
              }
            }
          } else {
            if (counterO.length < 3) {
              const newCounter = [...counterO, position]
  
              currentBoard.set(currentPlayer, position);
              setCounterO(newCounter)
              setCurrentPlayer(currentPlayer === Token.O ? Token.X : Token.O);
            } else {
              currentBoard.set(currentPlayer, position);
              const winner = currentBoard.checkWin();

              if (winner) {
                // Notify the user
                alert(`HANDLE CLICK ${winner} wins!`);
                setCounterO([])
                setCounterX([])
                // Create the larger board with the winning board in the center
                updateLargerBoard(winner, boardIndex!);
                setCurrentPlayer(currentPlayer === Token.O ? Token.X : Token.O);
              } else {
                setCurrentPlayer(currentPlayer === Token.O ? Token.X : Token.O);
                
                const splicedCounter = counterO.splice(1, 2)
                const newCounter = [...splicedCounter, position]
                
                setCounterO(newCounter)
                currentBoard.unSet(null, counterO[0])
              }
            }
          }
          //currentBoard.set(currentPlayer, { row: cellRow, col: cellCol });
          
          const winner = currentBoard.checkWin();
          if (winner) {
            alert(`LAST HANDLER ${winner} wins!`);
            updateLargerBoard(winner, boardIndex!);
            setCounterO([])
            setCounterX([])
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
        const position = { row: row, col: col }

        if (currentPlayer === Token.X) {
          if (counterX.length < 3) {
            const newCounter = [...counterX, position]
            
            currentBoard.set(currentPlayer, { row, col });
            setCounterX(newCounter)
            setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
          } else {
            currentBoard.set(currentPlayer, { row, col });
            const winner = currentBoard.checkWin();

            if (winner) {
              // Notify the user
              alert(`HANDLE CLICK ${winner} wins!`);
              setCounterO([])
              setCounterX([])
              // Create the larger board with the winning board in the center
              createLargerBoard(winner);
              setCurrentPlayer(winner === Token.X ? Token.O : Token.X);
            } else {
              setCurrentPlayer(currentPlayer === Token.X ? Token.O : Token.X);
              
              const splicedCounter = counterX.splice(1, 2)
              const newCounter = [...splicedCounter, position]
              
              setCounterX(newCounter)
              currentBoard.unSet(null, counterX[0])
            }
          }

        } else {
          if (counterO.length < 3) {
            const newCounter = [...counterO, position]

            currentBoard.set(currentPlayer, { row, col });
            setCounterO(newCounter)
            setCurrentPlayer(currentPlayer === Token.O ? Token.X : Token.O);
          } else {
            currentBoard.set(currentPlayer, { row, col });
            const winner = currentBoard.checkWin();

            if (winner) {
              // Notify the user
              alert(`HANDLE CLICK ${winner} wins!`);
              setCounterO([])
              setCounterX([])
              // Create the larger board with the winning board in the center
              createLargerBoard(winner);
              setCurrentPlayer(winner === Token.O ? Token.X : Token.X);
            } else {
              setCurrentPlayer(currentPlayer === Token.O ? Token.X : Token.O);
              
              const splicedCounter = counterO.splice(1, 2)
              const newCounter = [...splicedCounter, position]
              
              setCounterO(newCounter)
              currentBoard.unSet(null, counterO[0])
            }
          }
        }
      }
    }
  };

  console.log(gameIsWon)

  const updateLargerBoard = (winner: Token, boardIdx: { row: number; col: number }) => {
    const { row: boardRow, col: boardCol } = boardIdx;
    console.log("UpdatedBoard on Position:", boardIdx)

    currentBoard.setWinner(winner)
    const clonedCurrentBoard = currentBoard.setCompletedBoard(winner)

    const newLargerBoard = largerBoard
    newLargerBoard![boardRow][boardCol] = clonedCurrentBoard

    if (winner === Token.X) {
      if (largerBoardCounterX.length < 3) {
        const newCounter = [...largerBoardCounterX, boardIdx]
        setLargerBoardCounterX(newCounter)

        setLargerBoard(newLargerBoard);
        setCurrentPlayer(winner === Token.X ? Token.O : Token.X);
      } else {
        const newCounter = [...largerBoardCounterX, boardIdx]
        const gameWinner = checkWin(largerBoard!)
        setLargerBoardCounterX(newCounter)

        if (gameWinner) {
          alert(`UPDATE LARGER ${gameWinner} won the game`)
          setGameIsWon(true)
          const splicedCounter = largerBoardCounterX.splice(1, 2)
          const newCounter = [...splicedCounter, boardIdx]

          setLargerBoardCounterX(newCounter)
          // unSet(largerBoard!, largerBoardCounterX[0])
          // setLargerBoard(newLargerBoard)

          setLargerBoardCounterX([])
          setLargerBoardCounterO([])
        } else {
          setCurrentPlayer(winner === Token.X ? Token.O : Token.X)

          const splicedCounter = largerBoardCounterX.splice(1, 2)
          const newCounter = [...splicedCounter, boardIdx]

          setLargerBoardCounterX(newCounter)
          unSet(largerBoard!, largerBoardCounterX[0])
          setLargerBoard(newLargerBoard)
        }
      }
    } else {
      if (largerBoardCounterO.length < 3) {
        const newCounter = [...largerBoardCounterO, boardIdx]
        setLargerBoardCounterO(newCounter);

        setLargerBoard(newLargerBoard);
        setCurrentPlayer(winner === Token.O ? Token.X : Token.O)
      } else {
        const newCounter = [...largerBoardCounterO, boardIdx]
        const gameWinner = checkWin(largerBoard!)
        setLargerBoardCounterO(newCounter)

        if (gameWinner) {
          alert(`UPDATE LARGER ${gameWinner} won the game`)
          setGameIsWon(true)
          const splicedCounter = largerBoardCounterO.splice(1, 2)
          const newCounter = [...splicedCounter, boardIdx]

          setLargerBoardCounterO(newCounter)

          setLargerBoardCounterX([])
          setLargerBoardCounterO([])
        } else {
          setCurrentPlayer(winner === Token.O ? Token.X : Token.O)

          const splicedCounter = largerBoardCounterO.splice(1, 2)
          const newCounter = [...splicedCounter, boardIdx]

          setLargerBoardCounterO(newCounter)
          unSet(largerBoard!, largerBoardCounterO[0])
          setLargerBoard(newLargerBoard)
        }
      }
    }
    
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
    
    const position = {row: center, col: center}
    if (winner === Token.X) {
      const newCounter = [...largerBoardCounterX, position]
      setLargerBoardCounterX(newCounter)
    } else {
      const newCounter = [...largerBoardCounterO, position]
      setLargerBoardCounterO(newCounter)
    }

    // Update state
    setLargerBoard(newLargerBoard);
    setInitialBoard(null!);
    winner === Token.X ? setCurrentPlayer(Token.O) : setCurrentPlayer(Token.X);
    setCurrentBoard(null!);
    setSelectingBoard(true);
  };


  useEffect(() => {
    if (initialBoard) {
      const winner = currentBoard.checkWin();

      if (winner) {
        // Notify the user
        alert(`USE EFFECT ${winner} wins!`);
        setCounterO([])
        setCounterX([])
        // Create the larger board with the winning board in the center
        createLargerBoard(winner);
      } 
    } else {
      const winner = checkWin(largerBoard!)

      if (winner) {
        alert(`USE EFFECT ${winner} won the game!`)
        setCounterO([])
        setCounterX([])
      }
    }
  }, [currentPlayer]);

  const isBoardEmpty = (board: Board) => {
    return board.matrix.flat().every(cell => cell === null);
  };

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
