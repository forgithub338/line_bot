'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function DebugPage() {
  const [inClient, setInClient] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const liffId = '2007275305-5B4p9VMY';

    async function initLiff() {
      try {
        await liff.init({ liffId });
        await liff.ready; // ✅ 等到 liff 完全 ready 再用其他 API

        if (!liff.isLoggedIn()) {
          liff.login();
          return; // ⚠️ login 後頁面會 reload，不需要繼續往下執行
        }

        const profile = await liff.getProfile();
        const inClient = liff.isInClient();
        const canSend = await liff.isApiAvailable('sendMessages');

        setProfile(profile);
        setInClient(inClient);
        setCanSend(canSend);

        // ✅ 測試訊息
        if (inClient && canSend) {
          await liff.sendMessages([
            {
              type: 'text',
              text: '這是一則測試訊息 from LIFF 🎉',
            },
          ]);
        }

      } catch (err) {
        console.error('LIFF 初始化失敗', err);
        setError('LIFF 初始化失敗：' + String(err));
      } finally {
        setLoading(false);
      }
    }

    initLiff();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🔍 LIFF Debug</h1>
      {loading && <p>載入中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <p>是否在 LINE 客戶端中：{inClient ? '✅ 是' : '❌ 否'}</p>
      <p>可傳送：{canSend ? '✅ 是' : '❌ 否'}</p>
      <p>使用者名稱：{profile?.displayName || '無'}</p>
      <p>使用者 ID：{profile?.userId || '無'}</p>
    </div>
  );
}
