import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Board } from './classes/board';
import { Token, Index } from './types';
import { checkWin, unSet } from './utils';
import circle from "./assets/tictactoken/Circle2.png"
import cross from "./assets/tictactoken/Cross2.png"
import './App.css';

function App() {
  
  const [currentPlayer, setCurrentPlayer] = useState<Token>(Token.X);
  const [initialBoard, setInitialBoard] = useState(new Board(3));
  const [currentBoard, setCurrentBoard] = useState(initialBoard);
  const [selectingBoard, setSelectingBoard] = useState<boolean>(false);
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

      if (selectingBoard) {
        if (!largerBoard[boardRow][boardCol].winner) {
          setCurrentBoard(largerBoard[boardRow][boardCol]);
          setBoardIndex(boardIdx);
          setSelectingBoard(false);
        } else {
          alert(`This board is complete! ${largerBoard[boardRow][boardCol].winner} won.`);
        }
      } else {
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
          setGameIsWon(true)
          alert(`UPDATE LARGER ${gameWinner} won the game`)
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
          setGameIsWon(true)
          alert(`UPDATE LARGER ${gameWinner} won the game`)
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

  const restartGame = () => {
    setCurrentPlayer(Token.X);
    setInitialBoard(new Board(3));
    setCurrentBoard(new Board(3));
    setSelectingBoard(false);
    setLargerBoard(null);
    setBoardIndex(null);
    setCounterX([]);
    setLargerBoardCounterX([]);
    setCounterO([]);
    setLargerBoardCounterO([]);
    setGameIsWon(false);
  };


  useEffect(() => {
    if (initialBoard) {
      const winner = currentBoard.checkWin();

      if (winner) {
        // Notify the user
        alert(`${winner} wins the first match! Expanding Board...`);
        setCounterO([])
        setCounterX([])
        // Create the larger board with the winning board in the center
        createLargerBoard(winner);
      } 
    } else {
      const winner = checkWin(largerBoard!)

      if (winner) {
        setGameIsWon(true)
        alert(`${winner} won the game!`)
        setCounterO([])
        setCounterX([])
      }
    }
  }, [currentPlayer]);

  const isBoardEmpty = (board: Board) => {
    return board.matrix.flat().every(cell => cell === null);
  };

  //console.log("BigBoard:", largerBoard)
  //console.log("CurrentBoard:", currentBoard?.matrix)
  //console.log("currentPlayer:", currentPlayer)
  console.log("gameIsWon:", gameIsWon)

  const tokenVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  };

  const boardVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  const winnerVariants = {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 }
  };

  // Add this new function to determine if a cell is part of the winning line
  const isWinningCell = (board: Board, rowIdx: number, colIdx: number) => {
    if (!board.winner || !board.winningLine) return false;
    return board.winningLine.some(cell => cell.row === rowIdx && cell.col === colIdx);
  };

  return (
    <div className='w-screen flex items-center justify-center back'>
      <AnimatePresence>
        {gameIsWon && (
          <motion.div
            className='text-center absolute top-10 text-white'
            variants={winnerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="bg-white text-black p-2 rounded-md mb-4">
              <h4>Game is won! Reset the board to play again.</h4>
            </div>
            <motion.button 
              className='bg-slate-800 hover:bg-slate-100 hover:text-black text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'
              onClick={restartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Restart Game
            </motion.button>
          </motion.div>
        )}
        {!gameIsWon && (
          <motion.div
            className='text-center absolute top-20 text-white'
            variants={winnerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {selectingBoard && (
              <div className="bg-white text-black p-2 rounded-md">
                <h4 className="px-10">
                  Player {currentPlayer === Token.X ? 'X' : 'O'}, please select next board
                </h4>
              </div>
            )}
            {!selectingBoard && 
              <div className='bg-white text-black p-2 rounded-md'>
                <h4 className='px-10'>Current Player: {currentPlayer === Token.X ? 'X' : 'O'}</h4>
              </div>
            }
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className='board rounded-md bg-cyan-700 bg-opacity-50'
        variants={boardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key={largerBoard ? 'largerBoard' : 'initialBoard'}
      >
        {currentBoard ? (
          currentBoard.matrix.map((row, rowIdx) => (
            <div className='row' key={rowIdx}>
              {row.map((cell, colIdx) => (
                <div className={'cell rounded-md'} onClick={() => handleClick({ row: rowIdx, col: colIdx}, { row: rowIdx, col: colIdx })} key={colIdx}>
                  <AnimatePresence>
                    {cell && (
                      <motion.img 
                        className='w-20' 
                        src={(cell === Token.X ? cross : circle)} 
                        alt="token"
                        variants={tokenVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={`${rowIdx}-${colIdx}-${cell}`}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))
        ) : (
          largerBoard && largerBoard.map((boardRow, boardRowIdx) => (
            <div className='row' key={boardRowIdx}>
              {boardRow.map((board, boardColIdx) => (
                <div
                  className={`rounded-md bg-opacity-50 ${
                    isBoardEmpty(board) ? 'empty-board' : 'board'
                  }`}
                  key={boardColIdx}
                >
                  {board.matrix.map((row, rowIdx) => (
                    <div className='row' key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <div
                          className={`rounded-md bg-opacity-50 ${
                            board.winner !== null 
                              ? isWinningCell(board, rowIdx, colIdx)
                                ? 'big-cell-winner'
                                : board.winner === Token.X 
                                  ? 'big-cell-x' 
                                  : 'big-cell-o'
                              : 'cell'
                          }`}
                          onClick={() => handleClick({ row: boardRowIdx, col: boardColIdx }, { row: rowIdx, col: colIdx })}
                          key={colIdx}
                        >
                          <AnimatePresence>
                            {cell && (
                              <motion.img 
                                className='w-20' 
                                src={(cell === Token.X ? cross : circle)} 
                                alt="token"
                                variants={tokenVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                key={`${boardRowIdx}-${boardColIdx}-${rowIdx}-${colIdx}-${cell}`}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default App;
