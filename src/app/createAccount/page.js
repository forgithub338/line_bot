'use client';
import { useState, useEffect } from 'react';

export default function CreateAccount() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [league, setLeague] = useState('');
  const [camp, setCamp] = useState('');

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
      const data = await response.json();

      if (!response.ok) throw new Error('發生錯誤');

      alert(data.message);
    } catch (error) {
      alert('Error:', error);
      alert('發生錯誤，請稍後再試。');
    }
  }

  return (
    <div className="bg-blue-50 min-h-screen flex justify-center items-center py-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-6">
        {profile ? (
          <>
            <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">創建帳號</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-blue-700 mb-2">
                  遊戲名稱
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
                  placeholder="請輸入遊戲名稱"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="league" className="block text-lg font-medium text-blue-700 mb-2">
                  聯盟
                </label>
                <select
                  id="league"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
                  required
                >
                  <option value="">請選擇聯盟</option>
                  <option value="主盟">主盟</option>
                  <option value="分盟">分盟</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="camp" className="block text-lg font-medium text-blue-700 mb-2">
                  分營
                </label>
                <select
                  id="camp"
                  value={camp}
                  onChange={(e) => setCamp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
                  required
                >
                  <option value="">請選擇分營</option>
                  <option value="陷陣營">陷陣營</option>
                  <option value="虎衛營">虎衛營</option>
                  <option value="先登營">先登營</option>
                  <option value="神機營">神機營</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                送出表單
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-gray-700">尚未登入或未取得使用者資料</p>
        )}
      </div>
    </div>
  );
}
