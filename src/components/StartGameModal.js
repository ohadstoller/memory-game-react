export function StartGameModal(props) {
  return <div className="modal">
    {/*<StartButton onClick={startGame}/>*/}

    <form onSubmit={props.onSubmit}>
      <input onChange={props.onChange}
             value={props.value}
             placeholder="Add your name here"/>
      <button
        disabled={!props.value}
        type="submit">Start
      </button>
    </form>
  </div>;
}