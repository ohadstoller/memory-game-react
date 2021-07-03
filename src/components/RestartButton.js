export function RestartButton(props) {
  return <div className="lost">
    <div>You lost... Round: {props.gameData.round}</div>
    <div>Your score: {props.gameData.score}</div>
    <button onClick={props.onClick}>Restart</button>
  </div>;
}