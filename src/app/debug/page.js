'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function DebugPage() {
  const [inClient, setInClient] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const liffId = '2006989473-gqajDkdd';

    async function initLiff() {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const data = await liff.getProfile();
          const client = liff.isInClient();
          const send = liff.isApiAvailable("sendMessages")
          setInClient(client);
          setProfile(data)
          setCanSend(send)
        }

      } catch (error) {
        console.error('LIFF 初始化失敗', error);
      } finally {
        setLoading(false);
      }
    }

    initLiff();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🔍 LIFF Debug</h1>
      {error && <p className="text-red-500">錯誤：{error}</p>}
      <p>是否在 LINE 客戶端中：{inClient ? '✅ 是' : '❌ 否'}</p>
      <p>可傳送：{canSend ? "是" : "否"}</p>
      <p>使用者名稱：{profile?.displayName || '無'}</p>
      <p>使用者 ID：{profile?.userId || '無'}</p>
    </div>
  );
}
