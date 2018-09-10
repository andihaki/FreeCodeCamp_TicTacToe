import React from "react";

import Square from "../components/Square";
import CalculateWinner from "../components/CalculateWinner";

class Board extends React.Component {
  state = {
    squares: Array(9).fill(null),
    // availSpots: Array(9).fill(null),
    // squares: Array.from(Array(9).keys()),
    xIsPlaying: true,
    score: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shoulComponentUpdate", !nextState.xIsPlaying);
    let { squares, xIsPlaying } = nextState;
    if (!nextState.xIsPlaying) {
      // console.log(availSpots);
      this.minimax(squares, xIsPlaying);
      return true;
    }
    return false;
    // return !nextState.xIsPlaying;
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
        squares: squares,
        xIsPlaying: !this.state.xIsPlaying,
        availSpots: this.state.squares.filter(s => s !== "X" && s !== "O")
      }
      // ,
      // () => {
      //   // return this.aiTurn(i, this.state);
      //   let { squares, xIsPlaying, availSpots } = this.state;
      //   return this.minimax(squares, xIsPlaying, availSpots);
      // }
    );
  }

  // aiTurn(i, { squares, xIsPlaying }) {
  //   // const emptySquare = squares.filter((s, index) => s === null);
  //   const emptySquare = squares.indexOf(null);
  //   squares[emptySquare] = "O";
  //   this.setState({
  //     squares: squares,
  //     xIsPlaying: !xIsPlaying
  //   });
  //   // console.log(i, xIsPlaying, squares, emptySquare);
  // }

  minimax(newBoard, player) {
    const availSpots = newBoard.filter(s => s !== "O" && s !== "X");
    const emptySquare = newBoard.indexOf(null);
    newBoard[emptySquare] = "O";

    // if (checkWin(newBoard, huPlayer)) {
    //   return { score: -10 };
    // } else if (checkWin(newBoard, aiPlayer)) {
    //   return { score: 10 };
    // } else if (availSpots.length === 0) {
    //   return { score: 0 };
    // }
    const winner = CalculateWinner(newBoard);
    if (winner) {
      this.setState({ score: -10 });
    } else if (!winner && availSpots.length > 0) {
      this.setState({ score: 10 });
    } else {
      this.setState({ score: 0 });
    }

    console.log(newBoard, availSpots, this.state.score, winner);
    this.setState({
      squares: newBoard,
      xIsPlaying: !player
    });
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
