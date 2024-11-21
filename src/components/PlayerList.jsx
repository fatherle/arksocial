import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants'

const PlayerItem = ({ player }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PLAYER,
    item: { id: player.id, name: player.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  // Add touch event handlers for better mobile feedback
  const handleTouchStart = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)'
    e.currentTarget.style.backgroundColor = '#f0f0f0'
  }

  const handleTouchEnd = (e) => {
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.style.backgroundColor = '#f8fafc'
  }

  return (
    <div
      ref={drag}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        transition: 'transform 0.2s, background-color 0.2s'
      }}
      className="px-3 py-2 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-move border border-gray-200 touch-none select-none active:bg-gray-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {player.name}
    </div>
  )
}

const PlayerList = ({ players, setPlayers }) => {
  const unassignedPlayers = players.filter(p => !p.board)

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    drop: (item) => {
      setPlayers(prev => prev.map(p => 
        p.id === item.id 
          ? { ...p, board: null, position: { x: 0, y: 0 } }
          : p
      ))
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  })

  return (
    <div 
      ref={drop}
      className={`w-full mt-4 p-4 rounded-lg transition-colors ${
        isOver ? 'bg-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="grid grid-cols-2 gap-2">
        {unassignedPlayers.map(player => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

export default PlayerList
