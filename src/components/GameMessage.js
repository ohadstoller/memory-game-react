export function GameMessage(props) {
  return <div>
    {props.simonTurn && (
      <div>Simon say...</div>
    )}

    {props.playerTurn && (
      <div>Now do as Simon said</div>
    )}
  </div>;
}