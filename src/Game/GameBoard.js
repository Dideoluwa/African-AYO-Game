import React, { useState } from "react";
import "./GameBoard.css";

const GameBoard = () => {
  const [board, setBoard] = useState(Array(12).fill(4));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [wins, setWins] = useState([0, 0]);
  const [message, setMessage] = useState("Player 1's turn");

  const renderSeeds = (count) => {
    return Array(count)
      .fill(null)
      .map((_, index) => <div key={index} className="seed" />);
  };

  const isValidMove = (holeIndex) => {
    const playerSide =
      currentPlayer === 0 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    return playerSide.includes(holeIndex) && board[holeIndex] > 0;
  };

  const makeMove = (startHole) => {
    if (gameOver || !isValidMove(startHole)) return;

    let newBoard = [...board];
    let seeds = newBoard[startHole];
    newBoard[startHole] = 0;
    let currentHole = startHole;
    let newScores = [...scores];

    while (seeds > 0) {
      currentHole = (currentHole + 1) % 12;
      if (currentHole !== startHole) {
        newBoard[currentHole]++;
        seeds--;
      }
    }

    if (
      (currentHole < 6 && currentPlayer === 1) ||
      (currentHole >= 6 && currentPlayer === 0)
    ) {
      if (newBoard[currentHole] <= 3) {
        newScores[currentPlayer] += newBoard[currentHole];
        newBoard[currentHole] = 0;
      }
    }

    setBoard(newBoard);
    setScores(newScores);

    const playerSide =
      currentPlayer === 0 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    const isEmpty = playerSide.every((index) => newBoard[index] === 0);

    if (isEmpty) {
      checkGameOver(newBoard, newScores);
    } else {
      setCurrentPlayer(1 - currentPlayer);
      setMessage(`Player ${2 - currentPlayer}'s turn`);
    }
  };

  const checkGameOver = (currentBoard, currentScores) => {
    const totalRemaining = currentBoard.reduce((sum, count) => sum + count, 0);
    if (totalRemaining === 0) {
      const winner = currentScores[0] > currentScores[1] ? 0 : 1;
      const newWins = [...wins];
      newWins[winner]++;
      setWins(newWins);

      if (newWins[winner] === 3) {
        setMessage(`Player ${winner + 1} becomes Ota (Champion)! 🏆`);
        setGameOver(true);
      } else {
        setMessage(`Player ${winner + 1} wins this round!`);
        setTimeout(resetGame, 2000);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(12).fill(4));
    setScores([0, 0]);
    setGameOver(false);
    setCurrentPlayer(0);
    setMessage("Player 1's turn");
  };

  return (
    <div className="ayo-game">
      <div className="game-board">
        <div className="header">
          <h1>Ayo Game</h1>
          <div className="game-status">{message}</div>
        </div>

        <div className="scores">
          <div>
            Player 1 Score: {scores[0]} (Wins: {wins[0]})
          </div>
          <div>
            Player 2 Score: {scores[1]} (Wins: {wins[1]})
          </div>
        </div>

        <div className="board-row">
          {board.slice(0, 6).map((seeds, i) => (
            <button
              key={i}
              onClick={() => makeMove(i)}
              disabled={currentPlayer !== 0 || gameOver}
              className={`hole ${currentPlayer === 0 ? "active" : ""}`}
            >
              {renderSeeds(seeds)}
            </button>
          ))}
        </div>

        <div className="board-row">
          {board.slice(6).map((seeds, i) => (
            <button
              key={i + 6}
              onClick={() => makeMove(i + 6)}
              disabled={currentPlayer !== 1 || gameOver}
              className={`hole ${currentPlayer === 1 ? "active" : ""}`}
            >
              {renderSeeds(seeds)}
            </button>
          ))}
        </div>

        <button className="new-game-btn" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
