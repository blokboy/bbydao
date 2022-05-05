const InfoTab = () => {
  const NurseryCard = ({ card }) => {
    return <div>{card}</div>
  }

  const cards = ["nursery", "nurser 2", "nursery 3"]

  return (
    <div>
      {cards.map(card => (
        <NurseryCard card={card} />
      ))}
    </div>
  )
}

export default InfoTab
