export function GameMessage({simonTurn, playerTurn, isGameOver}) {
  return <div>
    {simonTurn && (
      <div>Simon say...</div>
    )}

    {playerTurn && (
      <div>Now do as Simon said</div>
    )}

    {isGameOver && (
      <div>The game is over</div>
    )}
  </div>;
}