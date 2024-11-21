import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { MultiBackend, createTransition, TouchTransition } from 'react-dnd-multi-backend'
import TacticsBoard from './components/TacticsBoard'
import PlayerList from './components/PlayerList'
import { UserPlusIcon } from '@heroicons/react/24/outline'

const MouseTransition = createTransition('mousedown', (event) => event.type === 'mousedown')

const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
      preview: true
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        enableMouseEvents: false,
        delayTouchStart: 0,
        touchSlop: 5,
        ignoreContextMenu: true,
        enableHoverOutsideTarget: false,
        enableKeyboardEvents: false,
        enableTouchEvents: true,
        dropEventsEnabled: true
      },
      preview: true,
      transition: TouchTransition
    }
  ]
}

function App() {
  const [players, setPlayers] = useState([
    { id: 1, name: '主席', position: { x: 0, y: 0 }, board: null },
    { id: 2, name: '老板', position: { x: 0, y: 0 }, board: null },
    { id: 3, name: '副主席', position: { x: 0, y: 0 }, board: null },
    { id: 4, name: 'John', position: { x: 0, y: 0 }, board: null },
    { id: 5, name: 'Jeffery', position: { x: 0, y: 0 }, board: null },
    { id: 6, name: '步兵', position: { x: 0, y: 0 }, board: null },
    { id: 7, name: '李老大', position: { x: 0, y: 0 }, board: null },
    { id: 8, name: 'Martin', position: { x: 0, y: 0 }, board: null },
    { id: 9, name: 'Nick', position: { x: 0, y: 0 }, board: null },
    { id: 10, name: 'Marco', position: { x: 0, y: 0 }, board: null },
    { id: 11, name: 'Hao', position: { x: 0, y: 0 }, board: null },
    { id: 12, name: 'JackyT', position: { x: 0, y: 0 }, board: null },
    { id: 13, name: '博士', position: { x: 0, y: 0 }, board: null },
    { id: 14, name: '小马', position: { x: 0, y: 0 }, board: null },
    { id: 15, name: '小吕', position: { x: 0, y: 0 }, board: null },
    { id: 16, name: 'Kim', position: { x: 0, y: 0 }, board: null },
    { id: 17, name: 'Eddie', position: { x: 0, y: 0 }, board: null },
    { id: 18, name: '六边形', position: { x: 0, y: 0 }, board: null },
    { id: 19, name: 'Alan', position: { x: 0, y: 0 }, board: null },
    { id: 20, name: 'Kai', position: { x: 0, y: 0 }, board: null },
    { id: 21, name: 'Patrick', position: { x: 0, y: 0 }, board: null },
    { id: 22, name: 'Biqi', position: { x: 0, y: 0 }, board: null },
    { id: 23, name: '尹珂', position: { x: 0, y: 0 }, board: null },
    { id: 24, name: 'Biqi', position: { x: 0, y: 0 }, board: null },
    { id: 25, name: 'Rivers', position: { x: 0, y: 0 }, board: null },
    { id: 26, name: 'Frank', position: { x: 0, y: 0 }, board: null },
    { id: 27, name: 'Matthew', position: { x: 0, y: 0 }, board: null },
    { id: 28, name: '郑有财', position: { x: 0, y: 0 }, board: null },
    { id: 29, name: 'Alex', position: { x: 0, y: 0 }, board: null },
  ])
  const [showPlayerForm, setShowPlayerForm] = useState(false)
  const [showPlayerList, setShowPlayerList] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [activeBoard, setActiveBoard] = useState('blue')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        {
          id: Date.now(),
          name: newPlayerName,
          position: { x: 0, y: 0 },
          board: null
        }
      ])
      setNewPlayerName('')
      setShowPlayerForm(false)
    }
  }

  const togglePlayerList = () => {
    setShowPlayerList(!showPlayerList)
    setShowPlayerForm(false)
  }

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        {
          id: Date.now(),
          name: newPlayerName,
          position: { x: 0, y: 0 },
          board: null
        }
      ])
      setNewPlayerName('')
      setShowPlayerForm(false)
    }
  }

  const showFeedbackMessage = (message) => {
    setFeedback(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-center py-8">
        {/* Feedback Toast */}
        {showFeedback && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg shadow-lg">
            {feedback}
          </div>
        )}
        <div className="w-full max-w-[1800px] p-4">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
              ARK足球战术板
            </h1>
            <p className="text-gray-600 text-lg">创建和分享您的足球战术</p>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mb-8">
            <div className="lg:w-[40%] flex flex-col items-center">
              <div className="mb-4 text-xl font-semibold text-blue-600">蓝队战术板</div>
              <div 
                className={`relative w-full transition-all duration-200 hover:scale-[1.02] ${
                  activeBoard === 'blue' ? 'ring-4 ring-blue-400 shadow-lg' : 'shadow-md hover:shadow-lg'
                }`}
                onClick={() => setActiveBoard('blue')}
              >
                <TacticsBoard 
                  id="blue" 
                  color="blue" 
                  players={players} 
                  setPlayers={setPlayers}
                  onDragStart={() => showFeedbackMessage('开始拖动球员')}
                  onDrop={(success) => showFeedbackMessage(success ? '球员已放置' : '放置失败')}
                />
              </div>
            </div>

            <div className="lg:w-[20%] flex flex-col items-center">
              <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={togglePlayerList}
                    className={`w-full flex items-center justify-center px-6 py-3 ${
                      showPlayerList ? 'bg-green-700' : 'bg-green-600'
                    } text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg`}
                  >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    安排人员
                  </button>
                  {showPlayerList && (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">可用球员</h2>
                        <button
                          onClick={() => setShowPlayerForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          添加球员
                        </button>
                      </div>
                      
                      {showPlayerForm && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <input
                            type="text"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="输入球员名字"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setShowPlayerForm(false)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={addPlayer}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                            >
                              确认添加
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <PlayerList
                        players={players}
                        setPlayers={setPlayers}
                        onAddPlayer={handleAddPlayer}
                        showForm={showPlayerForm}
                        setShowForm={setShowPlayerForm}
                        newPlayerName={newPlayerName}
                        setNewPlayerName={setNewPlayerName}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-[40%] flex flex-col items-center">
              <div className="mb-4 text-xl font-semibold text-red-600">红队战术板</div>
              <div 
                className={`relative w-full transition-all duration-200 hover:scale-[1.02] ${
                  activeBoard === 'red' ? 'ring-4 ring-red-400 shadow-lg' : 'shadow-md hover:shadow-lg'
                }`}
                onClick={() => setActiveBoard('red')}
              >
                <TacticsBoard 
                  id="red" 
                  color="red" 
                  players={players} 
                  setPlayers={setPlayers}
                  onDragStart={() => showFeedbackMessage('开始拖动球员')}
                  onDrop={(success) => showFeedbackMessage(success ? '球员已放置' : '放置失败')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

export default App
