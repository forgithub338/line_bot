'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function DebugPage() {
  const [inClient, setInClient] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function check() {
      try {
        await liff.init({ liffId: '2006989473-gqajDkdd' }); // 替換成你自己的 LIFF ID

        const inClient = liff.isInClient();
        const canSend = await liff.isApiAvailable('sendMessages');
        const profile = await liff.getProfile();

        setInClient(inClient);
        setCanSend(canSend);
        setProfile(profile);
      } catch (err) {
        setError(err.message || JSON.stringify(err));
      }
    }
    check();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🔍 LIFF Debug</h1>
      {error && <p className="text-red-500">錯誤：{error}</p>}
      <p>是否在 LINE 客戶端中：{inClient ? '✅ 是' : '❌ 否'}</p>
      <p>是否支援 sendMessages：{canSend ? '✅ 是' : '❌ 否'}</p>
      <p>使用者名稱：{profile?.displayName || '無'}</p>
      <p>使用者 ID：{profile?.userId || '無'}</p>
    </div>
  );
}
