import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  const checkQueue = () => {
    try {
      const q = JSON.parse(localStorage.getItem('civic_pulse_offline_queue') || '[]');
      setOfflineQueueCount(q.length);
    } catch {
      setOfflineQueueCount(0);
    }
  };

  useEffect(() => {
    checkQueue();
    const handleOnline = () => {
      setIsOnline(true);
      checkQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
      checkQueue();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, offlineQueueCount, refreshQueue: checkQueue };
}
