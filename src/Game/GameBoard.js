import { useState } from "react";
import SeedsLayout from "./SeedsLayout";
import { AyoGame } from "./GameLogic";
import "./GameBoard.css";

const GameBoard = () => {
  const [game, setGame] = useState(new AyoGame());
  const gameState = game.getState();

  const handleMove = (pitIndex) => {
    const newGame = new AyoGame();
    Object.assign(newGame, JSON.parse(JSON.stringify(game)));

    if (newGame.makeMove(pitIndex)) {
      setGame(newGame);
    }
  };

  const resetGame = () => {
    setGame(new AyoGame());
  };

  return (
    <div className="ayo-container">
      <div className="game-header">
        <h1 className="game-title">Ayo Game</h1>
      </div>

      <div className="game-board">
        <div className="score-display">
          <div>Player 1: {gameState.scores.player1} seeds</div>
          <div>Player 2: {gameState.scores.player2} seeds</div>
        </div>

        <div className="board-row">
          {gameState.board[1].map((seeds, index) => (
            <button
              key={`p2-${index}`}
              className={`pit ${gameState.currentPlayer === 1 ? "active" : ""}`}
              onClick={() => handleMove(index)}
              disabled={gameState.currentPlayer !== 1 || gameState.gameOver}
            >
              <SeedsLayout count={seeds} />
            </button>
          ))}
        </div>

        <div className="board-row">
          {gameState.board[0].map((seeds, index) => (
            <button
              key={`p1-${index}`}
              className={`pit ${gameState.currentPlayer === 0 ? "active" : ""}`}
              onClick={() => handleMove(index)}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
            >
              <SeedsLayout count={seeds} />
            </button>
          ))}
        </div>
      </div>

      <div className="game-status">
        {!gameState.gameOver &&
          `Current Player: ${gameState.currentPlayer + 1}`}
        {gameState.gameOver &&
          (() => {
            const winner =
              gameState.scores.player1 > gameState.scores.player2
                ? 1
                : gameState.scores.player1 < gameState.scores.player2
                ? 2
                : 0;
            return winner === 0
              ? "Game Over - It's a tie!"
              : `Game Over - Player ${winner} wins!`;
          })()}
      </div>

      {gameState.gameOver && (
        <button className="play-again" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameBoard;
