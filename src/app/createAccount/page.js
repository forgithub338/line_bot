"use client";
import { useState, useEffect } from "react";

export default function CreateAccount() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [league, setLeague] = useState("");
  const [camp, setCamp] = useState("")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('profile'));
    setProfile(data);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault(); // 防止重新整理
    setName(''); // 清空輸入欄

    try {
      const response = await fetch('/api/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          league: league,
          camp: camp,
          userName: profile.displayName,
          userId: profile.userId,
        }),
      });
      const data = await response.json()

      if (!response.ok) throw new Error('發生錯誤');

      alert(data.message);

    } catch (error) {
      alert('Error:', error);
      alert('發生錯誤，請稍後再試。');
    }
  }

  return (
    <div className="p-4">
      {profile ? (
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="font-bold">遊戲名稱</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="請輸入遊戲名稱"
              required
            />
            <label>聯盟</label>
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              required
            >
              <option value="">請選擇聯盟</option>
              <option value="主盟">主盟</option>
              <option value="分盟">分盟</option>
            </select>
            <label>分營</label>
            <select
              value={camp}
              onChange={(e) => setCamp(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
              required
            >
              <option value="">請選擇分營</option>
              <option value="陷陣營">陷陣營</option>
              <option value="虎衛營">虎衛營</option>
              <option value="先登營">先登營</option>
              <option value="神機營">神機營</option>
            </select>

            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              送出表單
            </button>
          </form>
        </div>
      ) : (
        <p>尚未登入或未取得使用者資料</p>
      )}
    </div>
  );
}
