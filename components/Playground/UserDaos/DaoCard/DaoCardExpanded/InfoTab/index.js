const InfoTab = () => {

  const NurseryCard = ({ card }) => {
    return <div>{card}</div>
  }

  const cards = ["nursery", "nursery 2", "nursery 3"]

  return (
    <div className="flex flex-col">
      <div className="text-xl">nurseries</div>
      {cards.map(card => (
        <NurseryCard card={card} />
      ))}
    </div>
  )
}

export default InfoTab
