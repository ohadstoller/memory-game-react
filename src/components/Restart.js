export function Restart(props) {
  return <div className="lost">
    <div>You lost... Score: {props.gameData.round}</div>
    <button onClick={props.onClick}>Restart</button>
  </div>;
}