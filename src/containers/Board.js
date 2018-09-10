import React from "react";

import Square from "../components/Square";
import CalculateWinner from "../components/CalculateWinner";

const huPlayer = "X";
const aiPlayer = "O";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

class Board extends React.Component {
  state = {
    squares: Array(9).fill(null),
    // squares: Array.from(Array(9).keys()),
    xIsPlaying: true
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.xIsPlaying) {
      this.aiTurn(0, nextState);
      // let { squares, xIsPlaying } = nextState;
      // return this.minimax(squares, xIsPlaying);
    }
    return !nextState.xIsPlaying;
  }

  handleClick(i) {
    let squares = this.state.squares.slice();
    // stop onclick kalau sudah ada winner
    if (CalculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsPlaying ? "X" : "O";
    this.setState(
      {
        squares,
        xIsPlaying: !this.state.xIsPlaying
      }
      // ,
      // () => {
      //   // return this.aiTurn(i, this.state);
      //   let { squares, xIsPlaying } = this.state;
      //   return this.minimax(squares, xIsPlaying);
      // }
    );
  }

  aiTurn(i, { squares, xIsPlaying }) {
    // const emptySquare = squares.filter((s, index) => s === null);
    const emptySquare = squares.indexOf(null);
    squares[emptySquare] = "O";
    this.setState({
      squares: squares,
      xIsPlaying: !xIsPlaying
    });
    // console.log(i, xIsPlaying, squares, emptySquare);
  }

  minimax(newBoard, player) {
    // var availSpots = emptySquares(newBoard);
    console.log(newBoard);
    let availSpots = newBoard.filter(s => s !== "O" && s !== "X");

    const checkWin = CalculateWinner(newBoard);
    if (checkWin && !player) {
      return { score: -10 };
    } else if (checkWin && player) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player === aiPlayer) {
        var result = this.minimax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        var result = this.minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    // ganti text 'Now Playing' ke 'Winner' / 'draw'
    const winner = CalculateWinner(this.state.squares);
    let status;
    const emptySquare = this.state.squares.includes(null);
    if (winner) {
      status = "Winner: " + winner;
    } else if (!winner && !emptySquare) {
      status = "It's Draw";
    } else {
      status = "Now Playing: " + (this.state.xIsPlaying ? "X" : "O");
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default Board;
