import { useState, useEffect } from 'react';

const getSunTimes = (latitude: number, longitude: number) => {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  // Solar declination
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  // Hour angle for sunrise/sunset
  const latRad = (latitude * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;
  const hourAngle =
    (Math.acos(-Math.tan(latRad) * Math.tan(declRad)) * 180) / Math.PI;

  // UTC offset from longitude
  const longitudeOffset = longitude / 15;

  // Sunrise and sunset in local hours
  const sunriseHour = 12 - hourAngle / 15 + longitudeOffset;
  const sunsetHour  = 12 + hourAngle / 15 + longitudeOffset;

  return { sunriseHour, sunsetHour };
};

export const useDayNight = (latitude?: number, longitude?: number) => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    const check = () => {
      const { sunriseHour, sunsetHour } = getSunTimes(latitude, longitude);
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / 60;

      setIsNight(currentHour < sunriseHour || currentHour > sunsetHour);
    };

    check(); // Run immediately

    // Re-check every minute
    const interval = setInterval(check, 60 * 1000);
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return { isNight };
};
