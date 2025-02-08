export class AyoGame {
  constructor() {
    this.board = Array(2)
      .fill()
      .map(() => Array(6).fill(4));
    this.scores = { player1: 0, player2: 0 };
    this.currentPlayer = 0;
    this.gameOver = false;
  }

  makeMove(pitIndex) {
    if (this.gameOver || this.board[this.currentPlayer][pitIndex] === 0) {
      return false;
    }

    let seeds = this.board[this.currentPlayer][pitIndex];
    this.board[this.currentPlayer][pitIndex] = 0;

    let currentPlayer = this.currentPlayer;
    let currentIndex = pitIndex;

    while (seeds > 0) {
      currentIndex++;
      if (currentIndex >= 6) {
        currentIndex = 0;
        currentPlayer = (currentPlayer + 1) % 2;
      }
      this.board[currentPlayer][currentIndex]++;
      seeds--;
    }

    if (
      this.board[currentPlayer][currentIndex] === 2 ||
      this.board[currentPlayer][currentIndex] === 3
    ) {
      const capturedSeeds = this.board[currentPlayer][currentIndex];
      this.board[currentPlayer][currentIndex] = 0;
      this.scores[`player${this.currentPlayer + 1}`] += capturedSeeds;
    }

    const player1Empty = this.board[0].every((pit) => pit === 0);
    const player2Empty = this.board[1].every((pit) => pit === 0);

    if (player1Empty || player2Empty) {
      this.gameOver = true;
      for (let i = 0; i < 2; i++) {
        const remainingSeeds = this.board[i].reduce(
          (sum, seeds) => sum + seeds,
          0
        );
        this.scores[`player${i + 1}`] += remainingSeeds;
        this.board[i].fill(0);
      }
    } else {
      this.currentPlayer = (this.currentPlayer + 1) % 2;
    }

    return true;
  }

  getState() {
    return {
      board: this.board,
      scores: this.scores,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
    };
  }
}
