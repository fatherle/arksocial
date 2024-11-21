import { useDrop } from 'react-dnd'
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { ShareIcon } from '@heroicons/react/24/outline'
import { ItemTypes } from '../constants'

const TacticsBoard = ({ id, color, players, setPlayers }) => {
  const boardRef = useRef(null)
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const boardRect = boardRef.current.getBoundingClientRect()
      
      // Calculate relative position within the board
      const x = ((offset.x - boardRect.left) / boardRect.width) * 100
      const y = ((offset.y - boardRect.top) / boardRect.height) * 100
      
      setPlayers(prev => prev.map(p => 
        p.id === item.id 
          ? { ...p, board: id, position: { x, y } }
          : p
      ))
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }))

  const handleShare = async () => {
    try {
      const canvas = await html2canvas(boardRef.current)
      const image = canvas.toDataURL('image/png')
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        const blob = await (await fetch(image)).blob()
        const file = new File([blob], 'tactics-board.png', { type: 'image/png' })
        await navigator.share({
          files: [file],
          title: 'ARK足球战术板',
          text: '分享我的战术板配置'
        })
      } else {
        // Fallback to download if Web Share API is not available
        const link = document.createElement('a')
        link.href = image
        link.download = `tactics-board-${id}-${Date.now()}.png`
        link.click()
      }
    } catch (error) {
      console.error('Error sharing board:', error)
    }
  }

  const boardPlayers = players.filter(p => p.board === id)

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        id={`board-${id}`}
        ref={node => {
          boardRef.current = node
          drop(node)
        }}
        className={`w-full aspect-[680/1050] rounded-lg shadow-lg ${
          color === 'blue' ? 'bg-blue-900' : 'bg-red-900'
        } relative border-2 ${
          color === 'blue' ? 'border-blue-500' : 'border-red-500'
        } transform transition-transform hover:scale-[1.02] ${
          isOver ? 'bg-opacity-90' : ''
        }`}
        style={{
          backgroundImage: `url('/soccer-field.svg')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '600px'
        }}
      >
        {boardPlayers.map(player => (
          <Player
            key={player.id}
            player={player}
            style={{
              position: 'absolute',
              left: `${player.position.x}%`,
              top: `${player.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
      <button
        onClick={handleShare}
        className="mt-4 flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ShareIcon className="h-5 w-5 mr-2" />
        分享阵型
      </button>
    </div>
  )
}

export default TacticsBoard
