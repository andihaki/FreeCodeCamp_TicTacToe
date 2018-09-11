import React from "react";

import Square from "../components/Square";
import CalculateWinner from "../components/CalculateWinner";

class Board extends React.Component {
  state = {
    squares: Array(9).fill(null),
    // availSpots: Array(9).fill(null),
    // squares: Array.from(Array(9).keys()),
    xIsPlaying: true,
    score: 0,
    maxPlayer: "X",
    minPlayer: "O"
  };

  // immutable old state
  copyState(state) {
    return Object.assign({}, state);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shoulComponentUpdate", !nextState.xIsPlaying);
    let { squares, xIsPlaying } = this.copyState(nextState);
    if (!nextState.xIsPlaying && nextState.squares !== this.state.squares) {
      // console.log(availSpots);
      // this.minimax(squares, xIsPlaying);
      let aiStep = this.findAiMove(squares);
      squares[aiStep] = "O";
      this.setState({ squares: squares });
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
    this.setState({
      squares: squares,
      xIsPlaying: !this.state.xIsPlaying,
      availSpots: this.state.squares.filter(s => s !== "X" && s !== "O")
    });
  }

  //Test for winner
  winner(board, player) {
    if (
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Test for Tie Game
  tie(board) {
    var moves = board.join("").replace(/ /g, "");
    if (moves.length === 9) {
      return true;
    }
    return false;
  }

  //Create a new version of the board to manipulate as a node on the tree
  copyBoard(board) {
    //This returns a new copy of the Board and ensures that you're only
    //manipulating the copies and not the primary board.
    return board.slice(0);
  }

  //Determine if a move is valid and return the new board state
  validMove(move, player, board) {
    var newBoard = this.copyBoard(board);
    if (newBoard[move] === null) {
      newBoard[move] = player;
      return newBoard;
    } else return null;
  }

  //This is the main AI function which selects the first position that
  //provides a winning result (or tie if no win possible)

  findAiMove(board) {
    let bestMoveScore = 100;
    let move = null;
    //Test Every Possible Move if the game is not already over.
    if (this.winner(board, "X") || this.winner(board, "O" || this.tie(board))) {
      return null;
    }

    for (let i = 0; i < board.length; i++) {
      let newBoard = this.validMove(i, this.state.minPlayer, board);
      //If validMove returned a valid game board
      // console.log("findAiMove", newBoard);
      if (newBoard) {
        let moveScore = this.maxScore(newBoard);
        if (moveScore < bestMoveScore) {
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  }

  minScore(board) {
    // console.log("minScore")
    if (this.winner(board, "X")) {
      return 10;
    } else if (this.winner(board, "O")) {
      return -10;
    } else if (this.tie(board)) {
      return 0;
    } else {
      var bestMoveValue = 100;
      let move = 0;
      for (var i = 0; i < board.length; i++) {
        var newBoard = this.validMove(i, this.state.minPlayer, board);
        if (newBoard) {
          var predictedMoveValue = this.maxScore(newBoard);
          if (predictedMoveValue < bestMoveValue) {
            bestMoveValue = predictedMoveValue;
            move = i;
          }
        }
      }
      //console.log("Best Move Value(minScore):", bestMoveValue);
      return bestMoveValue;
    }
  }

  maxScore(board) {
    // console.log("maxScore")
    if (this.winner(board, "X")) {
      return 10;
    } else if (this.winner(board, "O")) {
      return -10;
    } else if (this.tie(board)) {
      return 0;
    } else {
      let bestMoveValue = -100;
      let move = 0;
      for (let i = 0; i < board.length; i++) {
        let newBoard = this.validMove(i, this.state.maxPlayer, board);
        if (newBoard) {
          let predictedMoveValue = this.minScore(newBoard);
          if (predictedMoveValue > bestMoveValue) {
            bestMoveValue = predictedMoveValue;
            move = i;
          }
        }
      }
      return bestMoveValue;
    }
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

  // https://codepen.io/shoesandsocks/pen/evwgVZ
  // https://www.neverstopbuilding.com/blog/minimax
  // minimax(newBoard, player) {
  //   const availSpots = newBoard.filter(s => s !== "O" && s !== "X");
  //   const emptySquare = newBoard.indexOf(null);
  //   newBoard[emptySquare] = "O";
  //   // const winner = CalculateWinner(newBoard);
  //   // if (winner) {
  //   //   this.setState({ score: -10 });
  //   // } else if (!winner && availSpots.length > 0) {
  //   //   this.setState({ score: 10 });
  //   // } else {
  //   //   this.setState({ score: 0 });
  //   // }

  //   // -- http://douglasberg.com/blog/react/tic-tac-toe/ai/minimax/algorithm/2016/08/29/react-tictactoe-part-2.html
  //   let bestMoveScore = 100;
  //   let move = null;
  //   //Test Every Possible Move if the game is not already over.
  //   const winner = CalculateWinner(newBoard);
  //   if (winner || !emptySquare) {
  //     return null;
  //   }

  //   // looping kemungkinan posisi
  //   for (let i = 0; i < newBoard.length; i++) {
  //     // ada yg diilangin nih, please check kalo error
  //     // let newBoard = validMove(i, minPlayer, board);
  //     let moveScore = this.maxScore(newBoard);
  //   }

  //   console.log(newBoard, availSpots, this.state.score);
  //   this.setState({
  //     squares: newBoard,
  //     xIsPlaying: !player
  //   });
  // }

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
