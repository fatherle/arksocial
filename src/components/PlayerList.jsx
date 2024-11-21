import { useDrag } from 'react-dnd'
import { ItemTypes } from '../constants'

const PlayerItem = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { id: player.id, name: player.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      className={`px-3 py-2 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-move border border-gray-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {player.name}
    </div>
  )
}

const PlayerList = ({ players }) => {
  const unassignedPlayers = players.filter(p => !p.board)

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-2 gap-2">
        {unassignedPlayers.map(player => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

export default PlayerList
