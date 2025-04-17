'use client'

import { useEffect, useState } from 'react'

export default function DeleteAccount() {
  const [profile, setProfile] = useState(null)
  const [gameNames, setGameNames] = useState([])
  const [selectedGame, setSelectedGame] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('profile') || 'null')
    setProfile(data)

    async function fetchGameNames() {
      if (data?.userId) {
        try {
          const res = await fetch(`/api/deleteAccount?userId=${data.userId}`)
          const result = await res.json()
          setGameNames(result.data)
        } catch (err) {
          console.error('取得遊戲名稱失敗：', err)
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
      const res = await fetch('/api/deleteAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: profile.displayName,
          gameName: selectedGame,
        }),
      })

      const result = await res.json()
      alert(result.message || '刪除成功！')
    } catch (err) {
      console.error('刪除失敗：', err)
    }
  }

  return (
    <div className="bg-blue-50 min-h-screen px-4 py-6 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">刪除帳號</h1>

        {profile && (
          <>
            <p className="text-center text-gray-700 mb-6">
              你好，<span className="font-semibold text-blue-700">{profile.name}</span>
            </p>

            <div className="mb-4">
              <label className="block text-base font-medium text-blue-700 mb-1">選擇遊戲</label>
              <select
                value={selectedGame}
                onChange={handleGameChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
              >
                <option value="">-- 選擇遊戲 --</option>
                {gameNames.map((game, idx) => (
                  <option key={idx} value={game.gameName}>
                    {game.gameName}
                  </option>
                ))}
              </select>
            </div>

            {selectedGame && (
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 text-white py-3 rounded-lg text-base font-semibold hover:bg-red-600 transition-colors"
              >
                確認刪除帳號
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
