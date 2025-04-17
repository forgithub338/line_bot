'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import liff from '@line/liff';

export default function Page() {

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const liffId = '2007275305-5B4p9VMY';

    async function initLiff() {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const data = await liff.getProfile();
          localStorage.setItem('profile', JSON.stringify(data));
        }

      } catch (error) {
        console.error('LIFF 初始化失敗', error);
      } finally {
        setLoading(false);
      }
    }

    initLiff();
  }, []);

  const createAccount = () => {
    router.push('/createAccount');
  };

  const editAccount = () => {
    router.push('/editAccount');
  };

  const deleteAccount = () => {
    router.push('deleteAccount');
  };

  const debug = () => {
    router.push('debug');
  };

  return (
    <div className="bg-blue-50 min-h-screen flex justify-center items-center py-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-6">
        {loading ? (
          <div className="text-center text-lg text-blue-700">載入中...</div>
        ) : (
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
              歡迎使用 LIFF 頁面
            </h1>
            <button
              onClick={createAccount}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md w-48 hover:bg-blue-700 transition"
            >
              新增帳號
            </button>
            <button
              onClick={editAccount}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md w-48 hover:bg-blue-700 transition"
            >
              變更帳號資料
            </button>
            <button
              onClick={deleteAccount}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md w-48 hover:bg-blue-700 transition"
            >
              刪除帳號
            </button>
            <button
              onClick={debug}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md w-48 hover:bg-blue-700 transition"
            >
              debug
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
