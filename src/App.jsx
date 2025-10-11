import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo Section */}
        <div className="flex justify-center gap-8 mb-12">
          <a 
            href="https://vite.dev" 
            target="_blank"
            className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_2em_#646cffaa]"
          >
            <img 
              src={viteLogo} 
              className="h-24 w-24 animate-pulse" 
              alt="Vite logo" 
            />
          </a>
          <a 
            href="https://react.dev" 
            target="_blank"
            className="transition-transform hover:scale-110 hover:drop-shadow-[0_0_2em_#61dafbaa]"
          >
            <img 
              src={reactLogo} 
              className="h-24 w-24 animate-spin-slow" 
              alt="React logo" 
            />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Vite + React
        </h1>

        {/* Card Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="text-center">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 mb-4"
            >
              count is {count}
            </button>
            <p className="text-gray-300 text-lg">
              Edit <code className="bg-gray-800/50 px-2 py-1 rounded text-cyan-400">src/App.jsx</code> and save to test HMR
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
