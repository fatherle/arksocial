import { useDrop } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { ShareIcon } from '@heroicons/react/24/outline'
import { ItemTypes } from '../constants'

const DraggablePlayer = ({ player, style, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PLAYER,
    item: () => {
      onDragStart?.()
      return { id: player.id, name: player.name }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  // Add touch event handlers for better mobile feedback
  const handleTouchStart = (e) => {
    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
    e.currentTarget.style.backgroundColor = '#f0f0f0'
  }

  const handleTouchEnd = (e) => {
    e.currentTarget.style.transform = 'translate(-50%, -50%)'
    e.currentTarget.style.backgroundColor = '#ffffff'
  }

  return (
    <div
      ref={drag}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        transition: 'transform 0.2s, background-color 0.2s'
      }}
      className="bg-white px-4 py-2 rounded-lg shadow-md touch-none select-none active:scale-105 text-lg font-semibold min-w-[4rem] text-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {player.name}
    </div>
  )
}

const TacticsBoard = ({ id, color, players, setPlayers, onDragStart, onDrop }) => {
  const boardRef = useRef(null)
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset()
        const boardRect = boardRef.current.getBoundingClientRect()
        const x = ((offset.x - boardRect.left) / boardRect.width) * 100
        const y = ((offset.y - boardRect.top) / boardRect.height) * 100
        
        setPlayers(prev => prev.map(p => 
          p.id === item.id 
            ? { ...p, board: id, position: { x, y } }
            : p
        ))
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  })

  // Prevent scrolling when touching the board
  useEffect(() => {
    const board = boardRef.current
    if (!board) return

    const preventDefault = (e) => {
      e.preventDefault()
    }

    board.addEventListener('touchmove', preventDefault, { passive: false })
    return () => {
      board.removeEventListener('touchmove', preventDefault)
    }
  }, [])

  const handleShare = async () => {
    try {
      // Log share capabilities
      console.log('Share API available:', !!navigator.share)
      console.log('Share with files available:', !!(navigator.canShare && navigator.canShare({ files: [] })))

      // Create canvas and get image data
      const canvas = await html2canvas(boardRef.current)
      const imageDataUrl = canvas.toDataURL('image/png')

      // For mobile share
      if (navigator.share) {
        try {
          // Convert data URL to blob
          const response = await fetch(imageDataUrl)
          const blob = await response.blob()
          
          // Create file from blob
          const file = new File([blob], 'tactics-board.png', { 
            type: 'image/png',
            lastModified: Date.now()
          })

          // Log share attempt
          console.log('Attempting to share with file...')
          
          // Create files array for sharing
          const shareData = {
            files: [file],
            title: 'ARK足球战术板',
            text: '分享我的战术板配置'
          }

          // Check if we can share files
          if (navigator.canShare && navigator.canShare(shareData)) {
            console.log('File sharing is supported')
            await navigator.share(shareData)
          } else {
            console.log('Basic sharing fallback')
            // Fallback to basic share if file sharing is not supported
            await navigator.share({
              title: 'ARK足球战术板',
              text: '分享我的战术板配置'
            })
          }
          return
        } catch (error) {
          console.log('Share failed:', error.name, error.message)
          // Continue to fallback options if share fails
        }
      } else {
        console.log('Share API not available')
      }

      // Fallback for desktop: try clipboard
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const response = await fetch(imageDataUrl)
          const blob = await response.blob()
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ])
          alert('战术板已复制到剪贴板')
          return
        } catch (error) {
          console.log('Clipboard failed:', error)
        }
      }

      console.log('Falling back to download')
      // Final fallback: download
      const link = document.createElement('a')
      link.href = imageDataUrl
      link.download = `tactics-board-${id}-${Date.now()}.png`
      link.click()
    } catch (error) {
      console.error('Error sharing board:', error)
      alert('分享失败，请重试')
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
        } transform transition-transform ${
          isOver ? 'bg-opacity-90 scale-[1.01]' : ''
        }`}
        style={{
          backgroundImage: `url('/soccer-field.svg')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '600px',
          touchAction: 'none'
        }}
      >
        {boardPlayers.map(player => (
          <DraggablePlayer
            key={player.id}
            player={player}
            onDragStart={onDragStart}
            style={{
              position: 'absolute',
              left: `${player.position.x}%`,
              top: `${player.position.y}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
              zIndex: 10
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
