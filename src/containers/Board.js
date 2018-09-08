import React from "react";

import Square from "../components/Square";
import CalculateWinner from "../components/CalculateWinner";

class Board extends React.Component {
  state = {
    squares: Array(9).fill(null),
    // squares: Array.from(Array(9).keys()),
    xIsPlaying: true
  };

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
      },
      () => this.aiTurn(i, this.state)
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
    console.log(i, xIsPlaying, squares, emptySquare);
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
