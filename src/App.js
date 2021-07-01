import './App.css';
import {useEffect, useState} from "react";
import ColorCard from "./components/ColorCard";
import wait, {colorList} from "./utils/utils";
import {initGameData} from "./utils/utils";

const FLASH_INTERVAL = 500; // seconds

function App() {
  const [isGameOn, setGameOn] = useState(false);
  const [gameData, setGameData] = useState(initGameData);
  const [flashColor, setFlashColor] = useState("");

  const startGame = () => {
    setGameOn(true);
  }

  const restartGame = async () => {
    await setGameOn(false);
    startGame()
  }

  useEffect(() => {
    if (isGameOn) {
      setGameData({...initGameData, isFlashing: true});
    }
  }, [isGameOn]);

  useEffect(() => {
    if (isGameOn && gameData.isFlashing) {
      // pick a new random color from our color list
      const newColor = colorList[Math.floor(Math.random() * colorList.length)];
      const nextRoundColors = [...gameData.colors, newColor];

      setGameData({...gameData, colors: nextRoundColors});
    }
  }, [isGameOn, gameData.isFlashing]);

  useEffect( () => {
    let shouldFlashColors = isGameOn && gameData.isFlashing && gameData.colors.length
    if (shouldFlashColors) {
      flashColors();
    }
  }, [isGameOn, gameData.isFlashing, gameData.colors.length]);


  const flashColors = async () => {
    await wait(FLASH_INTERVAL);

    for (let i = 0; i < gameData.colors.length; i++) {
      setFlashColor(gameData.colors[i]);
      await wait(FLASH_INTERVAL);
      setFlashColor("");
      await wait(FLASH_INTERVAL);

      if (i === gameData.colors.length - 1) {

        setGameData({
          ...gameData,
          isFlashing: false,
          isUserPlaying: true,
          userGuessedColors: [...gameData.colors],
        });
      }
    }
  }

  async function userClickHandle(guessedColor) {
    const {isFlashing, isUserPlaying} = gameData
    
    if (!isFlashing && isUserPlaying) {
      setFlashColor(guessedColor);
      await wait(FLASH_INTERVAL);
      setFlashColor("");

      const remainingColorsToGuess = [...gameData.userGuessedColors];
      const nextColorToGuess = remainingColorsToGuess.shift();

      // if user picked to right color
      if (guessedColor === nextColorToGuess) {
        // and user has more colors to guess
        if (remainingColorsToGuess.length) {
          // continue round with remaining colors
          setGameData({...gameData, userGuessedColors: remainingColorsToGuess});
        }
        // else - round is finished successfully
        else {
          setGameData({
            ...gameData,
            isFlashing: true,
            isUserPlaying: false,
            round: gameData.colors.length,
            userGuessedColors: [],
          });
        }
      }
      // else - user picked a wrong color
      else {
        // TODO: save score and compare to high score

        // initialize new game
        setGameData({...initGameData, round: gameData.colors.length});
      }
    }
  }

  const gameNotStarted = !isGameOn && gameData.round === 0
  const gameOver = isGameOn && !gameData.isFlashing && !gameData.isUserPlaying && gameData.round > 0

  return (
    <div className="app-container">

        <div className="colors-container">
          {colorList.map((color, colorIndex) => (
            <ColorCard key={colorIndex}
              onClick={() => userClickHandle(color)}
              flash={flashColor === color}
              color={color}
            />
          ))}
        </div>

        {gameOver && (
          <div className="lost">
            <div>You lost... Score: {gameData.round}</div>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}

        {gameNotStarted && (
          <button onClick={startGame} className="start-game-button">
            Start
          </button>
        )}

        {isGameOn && (
          <div className="round">{gameData.round}</div>
        )}

    </div>
  );
}

export default App;