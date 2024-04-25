import { useState } from "react";
import confetti from "canvas-confetti";
const TURNS = {
  x: "x",
  o: "o",
};

const Square = ({ children, isSelected, isLine, isX, updateBoard, index }) => {
  let className = "square";
  if (isSelected) className += " is-selected";
  if (isLine) className += " is-line";
  className += isX ? " is-x" : " is-o";

  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

function App() {
  const [board, setBoard] = useState(
    Array(9).fill(null)
  );
  const [turn, setTurn] = useState(TURNS.x);
  const [winner, setWinner] = useState(null);
  const [line, setLine] = useState([]);
  const [message, setMessage] = useState(false)

  const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]


  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);

    if(newWinner){
      confetti()
      setWinner(newWinner);
    }else if (checkEndGame(newBoard)){
      setWinner(false)
      setMessage(true)
    }

    if (newWinner !== null) {
      setTimeout(() => {
        setMessage(true)
      }, 700)
    }else{
      const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;
      setTurn(newTurn);
    }
  };

  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS){
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ){
        setLine(combo)
        return boardToCheck[a]
      }
    }
    return null
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x;
    setTurn(newTurn);
    setLine([])
    setMessage(false)
  }

  const checkEndGame = (boardToCheck) => {
    return boardToCheck.every((square) => square !== null)
  }

  return (
    <main className="board">
      <h1> Triky </h1>
      <button onClick={resetGame}>Reiniciar Juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard}
              isLine={line.includes(index)}
              isX={board[index] ===TURNS.x}
            >
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.x && !message}>{TURNS.x}</Square>
        <Square isSelected={turn === TURNS.o && !message}>{TURNS.o}</Square>
      </section>

      {
        message && (
          <section className="winner ">
            <div className="text">
              <h2>
                {winner === false ? 'Empate' : 'Ganó'}
              </h2>

            <header className="win">
              { winner && <Square isLine isX={winner === TURNS.x}>{winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
            </div>
          </section>
        )
      }
    </main>
  );
}

export default App;
