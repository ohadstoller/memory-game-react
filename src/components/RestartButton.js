export function RestartButton({gameData, onClick}) {
  return <div className="lost">
    <div>You lost... </div>
    <div>Your score: {gameData.score}</div>
    <button onClick={onClick}>Restart</button>
  </div>;
}