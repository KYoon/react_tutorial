import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={"square" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = []
    for (let rowCounter = 0; rowCounter < 3; rowCounter++) {
      let boxes = []
      let squareIncremter = rowCounter * 3
      let squareLimiter = squareIncremter + 3
      for (let squareCounter = squareIncremter; squareCounter < squareLimiter; squareCounter++) {
        boxes.push(this.renderSquare(squareCounter))
      }
      rows.push(<div key={"boardRow" + rowCounter} className="board-row">{boxes}</div>)
    }
    return rows
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      movesAreAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  determinePreviousMove(currentMoves, previousMoves) {
    for (let i = 0; i < currentMoves.length; i++) {
      if (currentMoves[i] !== previousMoves[i]) {
        let column = i % 3 + 1
        let row = 1
        if (i > 2 && i < 6) {
          row = 2
        } else if (i > 5) {
          row = 3
        }
        return "move of " + currentMoves[i] + " in column " + column + " and row " + row
      }
    }
  }

  reverseMovesOrder() {
    this.setState({
      movesAreAscending: !this.state.movesAreAscending
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = ""
      if (move) {
        const previousMove = this.determinePreviousMove(step.squares, history[move - 1].squares)
        desc = 'Go to move #' + move + " with " + previousMove
      } else {
        desc = 'Go to game start'
      }
      const buttonStyle = move === this.state.stepNumber ?
        {fontWeight: "bold"} :
        null;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={buttonStyle}>{desc}</button>
        </li>
      );
    });

    const orderedMoves = this.state.movesAreAscending ?
        <ol>{ moves }</ol> :
        <ol reversed>{ moves.reverse() }</ol>

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={() => this.reverseMovesOrder()}>Reverse moves order</button>
          { orderedMoves }
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
