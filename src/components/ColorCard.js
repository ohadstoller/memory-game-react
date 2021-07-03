export default function ColorCard({color, onClick, flash}) {
  return (
    <div
      onClick={onClick}
      className={`color-circle-button ${color} ${flash ? "flash" : ""}`}/>
  )
}