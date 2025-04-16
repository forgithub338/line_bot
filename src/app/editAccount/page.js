"use client"

import { useEffect, useState } from "react"

export default function EditAccount() {
  const [profile, setProfile] = useState(null)
  const [gameNames, setGameNames] = useState([])
  const [selectedGame, setSelectedGame] = useState('')
  const [newGameName, setnewGameName] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('profile') || 'null')
    setProfile(data)

    async function fetchGameNames() {
      if (data && data.userId) {
        try {
          const response = await fetch(`/api/editAccount?userId=${data.userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const result = await response.json()
          setGameNames(result.data) // ✅ 抓 data 陣列
        } catch (error) {
          console.error('Error fetching games:', error)
        }
      }
    }

    fetchGameNames()
  }, [])

  const handleGameChange = (e) => {
    setSelectedGame(e.target.value)
  }

  const handleUpdate = async () => {
    if (!selectedGame || !newGameName) return

    try {
      const response = await fetch('/api/editAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: profile.displayName,
          oldGameName: selectedGame,
          newGameName: newGameName,
        }),
      })

      const result = await response.json()
      alert(result.message || '更新成功！')

      // 可選：更新資料
      setnewGameName('')
    } catch (error) {
      console.error('更新失敗:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Account</h1>

      {profile && (
        <>
          <p className="mb-2">Hello, {profile.name}</p>

          <label htmlFor="gameSelect" className="block mb-2">
            Select a game:
          </label>
          <select
            id="gameSelect"
            value={selectedGame}
            onChange={handleGameChange}
            className="border rounded p-2 mb-4"
          >
            <option value="">-- Choose a game --</option>
            {gameNames.map((game, idx) => (
              <option key={idx} value={game.gameName}>
                {game.gameName}
              </option>
            ))}
          </select>

          {selectedGame && (
            <div className="mt-4">
              <p>You selected: <strong>{selectedGame}</strong></p>

              <input
                type="text"
                placeholder="New user name"
                value={newGameName}
                onChange={(e) => setnewGameName(e.target.value)}
                className="border rounded p-2 mt-2 block"
              />

              <button
                onClick={handleUpdate}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                更新
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
