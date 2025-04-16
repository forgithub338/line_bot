'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import liff from '@line/liff';

export default function Page() {

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const liffId = '2006989473-gqajDkdd';

    async function initLiff() {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const data = await liff.getProfile();
          localStorage.setItem("profile", JSON.stringify(data))
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
  }

  const editAccount = () => {
    router.push('/editAccount');
  }

  const deleteAccount = () => {
    router.push('deleteAccount');
  }

  return (
    <div>
      {loading ? (
        <div>載入中...</div>
      ) : (
        <div>
          <div className="flex flex-col gap-4 items-center mt-8">
            <button onClick={createAccount} className="bg-[#082567] text-white font-bold px-4 py-2 rounded-md w-48 text-center no-underline block">
              新增帳號
            </button>
            <button onClick={editAccount} className="bg-[#082567] text-white font-bold px-4 py-2 rounded-md w-48 text-center no-underline block">
              變更帳號資料
            </button>
            <button onClick={deleteAccount} className="bg-[#082567] text-white font-bold px-4 py-2 rounded-md w-48 text-center no-underline block">
              刪除帳號
            </button>
          </div>
        </div>
      )}
    </div>
  );
}