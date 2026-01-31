import React from 'react'

const Nav = () => {
  return (
    <div className="max-w-sm mx-auto mb-4 flex justify-between">
        <button
          
          className={`px-4 py-2 rounded-xl text-sm bg-pink-500 text-white`}
        >
          🎰 Juego
        </button>
        <button
          
          className={`px-4 py-2 rounded-xl text-sm bg-pink-500 text-white `}
        >
          🧑‍💼 Admin
        </button>
      </div>
  )
}

export default Nav