"use client"

import { useEffect, useState } from "react"

export default function DeleteAccount() {
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
          const response = await fetch(`/api/deleteAccount?userId=${data.userId}`, {
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

  const handleDelete = async () => {
    if (!selectedGame) return

    try {
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: profile.displayName,
          gameName: selectedGame,
        }),
      })

      const result = await response.json()
      alert(result.message || '刪除成功！')

      // 可選：更新資料
      setnewGameName('')
    } catch (error) {
      console.error('刪除失敗:', error)
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
              <button
                onClick={handleDelete}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                確認刪除帳號
              </button>
          )}
        </>
      )}
    </div>
  )
}
