'use client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [inClient, setInClient] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function check() {
      try {
        const inClient = window.liff?.isInClient?.();
        const canSend = await window.liff?.isApiAvailable?.('sendMessages');
        const profile = await window.liff?.getProfile();

        setInClient(inClient);
        setCanSend(canSend);
        setProfile(profile);
      } catch (err) {
        alert('錯誤：' + (err.message || err));
      }
    }
    check();
  }, []);

  return (
    <div className="p-4">
      <h1>🔍 LIFF Debug</h1>
      <p>是否在 LINE 客戶端中：{inClient ? '✅ 是' : '❌ 否'}</p>
      <p>是否支援 sendMessages：{canSend ? '✅ 是' : '❌ 否'}</p>
      <p>使用者名稱：{profile?.displayName || '無'}</p>
      <p>使用者 ID：{profile?.userId || '無'}</p>
    </div>
  );
}
