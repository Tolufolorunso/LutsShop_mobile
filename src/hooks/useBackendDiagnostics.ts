import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL, apiClient } from '@/config/api';

export type ConnectivityStatus = 'idle' | 'checking' | 'connected' | 'degraded' | 'offline';

export interface BackendDiagnostics {
  apiUrl: string;
  latencyMs: number | null;
  status: ConnectivityStatus;
  lastChecked: string | null;
  checkConnection: () => Promise<void>;
}

export function useBackendDiagnostics(): BackendDiagnostics {
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [status, setStatus] = useState<ConnectivityStatus>('idle');
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    setStatus('checking');
    const start = Date.now();

    try {
      // Ping the lightweight products endpoint to test backend responsiveness
      await apiClient.get('/api/products', { limit: 1 }, { timeoutMs: 4000 });
      const duration = Date.now() - start;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setLatencyMs(duration);
      setStatus(duration > 800 ? 'degraded' : 'connected');
      setLastChecked(timeStr);
    } catch {
      const duration = Date.now() - start;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setLatencyMs(duration > 4000 ? null : duration);
      setStatus('offline');
      setLastChecked(timeStr);
    }
  }, []);

  // Run initial diagnostic ping on mount via microtask
  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(() => {
      if (isMounted) {
        checkConnection();
      }
    });

    return () => {
      isMounted = false;
    };
  }, [checkConnection]);

  return {
    apiUrl: API_BASE_URL,
    latencyMs,
    status,
    lastChecked,
    checkConnection,
  };
}
