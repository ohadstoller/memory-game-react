import './App.css'
import * as _ from "lodash";
import {useEffect, useState} from "react"
import ColorCard from "./components/ColorCard"
import wait from "./utils/utils"
import {RestartButton} from "./components/RestartButton"
import {GameMessage} from "./components/GameMessage"
import {Score} from "./components/Score"
import {StartGameModal} from "./components/StartGameModal"


const FLASH_INTERVAL = 500 // ml

function App() {
  const colorList = ["green", "red", "yellow", "blue", "purple", "pink"]
  const initGameData = {
    isFlashing: false,
    isUserPlaying: false,
    colors: [],
    round: 1,
    userColors: [],
    score: 0,
    playerName: null
  };

  const [isGameOn, setGameOn] = useState(false)
  const [gameData, setGameData] = useState(initGameData)
  const [newPlayerName, setNewPlayerName] = useState(null)
  const [flashColor, setFlashColor] = useState(null)
  const [playersData, setPlayersData] = useState([])


  useEffect(() => {
    if (isGameOn) {
      setGameData({...initGameData, isFlashing: true})
    }
  }, [isGameOn])

  useEffect(() => {
    if (isGameOn && gameData.isFlashing) {
      // pick a new random color from our color list
      const newColor = colorList[Math.floor(Math.random() * colorList.length)]
      const nextRoundColors = [...gameData.colors, newColor]

      setGameData({...gameData, colors: nextRoundColors})
    }
  }, [isGameOn, gameData.isFlashing])

  useEffect( () => {
    let shouldFlashColors = isGameOn && gameData.isFlashing && gameData.colors.length
    if (shouldFlashColors) {
      flashColors()
    }
  }, [isGameOn, gameData.isFlashing, gameData.colors.length])



  const flashColors = async () => {
    await wait(FLASH_INTERVAL)
    for (let i = 0; i < gameData.colors.length; i++) {
      setFlashColor(gameData.colors[i])
      await wait(FLASH_INTERVAL)
      setFlashColor(null)
      await wait(FLASH_INTERVAL)

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

  const userClickHandle = async (guessedColor) => {
    const {isFlashing, isUserPlaying} = gameData
    if (!isFlashing && isUserPlaying) {
      setFlashColor(guessedColor)
      await wait(FLASH_INTERVAL)
      setFlashColor(null)
      const remainingColorsToGuess = [...gameData.userGuessedColors]
      const nextColorToGuess = remainingColorsToGuess.shift()
      // if user picked to right color
      if (guessedColor === nextColorToGuess) {

        // and user has more colors to guess
        if (remainingColorsToGuess.length) {
          // continue round with remaining colors
          setGameData({...gameData, userGuessedColors: remainingColorsToGuess})
        }
        // else - round is finished successfully
        else {
          gameData.score += 10
          setGameData({
            ...gameData,
            isFlashing: true,
            isUserPlaying: false,
            round: gameData.colors.length + 1,
            userGuessedColors: [],
          });
        }
      }
      // else - user picked a wrong color
      else {
        await setPlayersData(playersData.concat({score: gameData.score, name: newPlayerName, id: Date.now()}))
        // initialize new game
        await setGameData({...initGameData, score: gameData.score})

      }
    }
  }

  const startGame = () => {
    setGameOn(true)
  }

  const restartGame = async () => {
    setNewPlayerName(null)
    setGameOn(false)
  }

  const handleNameChange = (event) => {
    const nameValue = event.target.value
    setNewPlayerName(nameValue)
  }

  const gameNotStarted = !isGameOn && gameData.round === 1
  const isGameOver = isGameOn && !gameData.isFlashing && !gameData.isUserPlaying && gameData.round > 0
  const isSimonTurn = isGameOn && gameData.isFlashing
  const isPlayerTurn = isGameOn && gameData.isUserPlaying

  return (
    <div className="game-container">
      <div className="score-table">
        {
          _.orderBy(playersData, ["score"], ["desc"]).map(
            ({score, name, id}) => (
              <Score key={id} name={name} score={score}/>
            )
          )
        }
      </div>
      <GameMessage simonTurn={isSimonTurn} playerTurn={isPlayerTurn} isGameOver={isGameOver}/>
      <div className="colors-container">
        {colorList.map((color, colorIndex) => (
          <ColorCard key={colorIndex}
                     onClick={() => userClickHandle(color)}
                     flash={flashColor === color}
                     color={color}
          />
        ))}
      </div>
      {isGameOver && (
        <RestartButton gameData={gameData} onClick={restartGame}/>
      )}
      {gameNotStarted && (
        <StartGameModal onSubmit={startGame} onChange={handleNameChange} value={newPlayerName}/>
      )}

      {isGameOn && (
        <div className="score">Score:{gameData.score}</div>
      )}


    </div>

  );
}

export default App;