'use client'

import { useEffect, useState } from 'react'

export default function EditAccount() {
  const [profile, setProfile] = useState(null)
  const [gameNames, setGameNames] = useState([])
  const [selectedGame, setSelectedGame] = useState('')
  const [newGameName, setNewGameName] = useState('')
  const [league, setLeague] = useState('')
  const [camp, setCamp] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('profile') || 'null')
    setProfile(data)

    async function fetchGameNames() {
      if (data?.userId) {
        try {
          const res = await fetch(`/api/editAccount?userId=${data.userId}`)
          const result = await res.json()
          setGameNames(result.data)
        } catch (err) {
          console.error('取得遊戲名稱失敗：', err)
        }
      }
    }

    fetchGameNames()
  }, [])

  const handleUpdate = async () => {
    if (!selectedGame || !newGameName) return

    try {
      const res = await fetch('/api/editAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: profile.displayName,
          oldGameName: selectedGame,
          newGameName,
          league,
          camp,
        }),
      })

      const result = await res.json()
      alert(result.message || '更新成功！')
      setNewGameName('')
    } catch (err) {
      console.error('更新失敗：', err)
    }
  }

  return (
    <div className="bg-blue-50 min-h-screen px-4 py-6 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">編輯帳號</h1>

        {profile && (
          <>
            <p className="text-center text-gray-700 mb-6">
              你好，<span className="font-semibold text-blue-700">{profile.name}</span>
            </p>

            <div className="mb-4">
              <label className="block text-base font-medium text-blue-700 mb-1">選擇遊戲</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-800"
              >
                <option value="">-- 選擇遊戲 --</option>
                {gameNames.map((game, idx) => (
                  <option key={idx} value={game.gameName}>{game.gameName}</option>
                ))}
              </select>
            </div>

            {selectedGame && (
              <>
                <div className="mb-4">
                  <label className="block text-base font-medium text-blue-700 mb-1">新的使用者名稱</label>
                  <input
                    type="text"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    placeholder="輸入新的使用者名稱"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-800"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-base font-medium text-blue-700 mb-1">聯盟</label>
                  <select
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-800"
                  >
                    <option value="">請選擇聯盟</option>
                    <option value="主盟">主盟</option>
                    <option value="分盟">分盟</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-base font-medium text-blue-700 mb-1">分營</label>
                  <select
                    value={camp}
                    onChange={(e) => setCamp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-800"
                  >
                    <option value="">請選擇分營</option>
                    <option value="陷陣營">陷陣營</option>
                    <option value="虎衛營">虎衛營</option>
                    <option value="先登營">先登營</option>
                    <option value="神機營">神機營</option>
                  </select>
                </div>

                <button
                  onClick={handleUpdate}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
                >
                  確認更新
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
