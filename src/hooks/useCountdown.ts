import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCountdownResult {
  secondsLeft: number;
  isActive: boolean;
  restart: (seconds?: number) => void;
  formatted: string;
}

export function useCountdown(initialSeconds: number): UseCountdownResult {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const restart = useCallback(
    (seconds: number = initialSeconds) => {
      clear();
      setSecondsLeft(seconds);
    },
    [initialSeconds],
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      clear();
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return clear;
  }, [secondsLeft > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return { secondsLeft, isActive: secondsLeft > 0, restart, formatted };
}
