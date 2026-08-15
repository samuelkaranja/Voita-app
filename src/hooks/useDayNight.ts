import { useState, useEffect } from 'react';

const getSunTimes = (latitude: number, longitude: number) => {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  const declination =
    23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  const latRad = (latitude * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;
  const hourAngle =
    (Math.acos(-Math.tan(latRad) * Math.tan(declRad)) * 180) / Math.PI;

  // Solar noon in UTC
  const solarNoonUTC = 12 - longitude / 15;

  // Sunrise/sunset in UTC hours
  const sunriseUTC = solarNoonUTC - hourAngle / 15;
  const sunsetUTC = solarNoonUTC + hourAngle / 15;

  return { sunriseUTC, sunsetUTC };
};

export const useDayNight = (latitude?: number, longitude?: number) => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    const check = () => {
      const { sunriseUTC, sunsetUTC } = getSunTimes(latitude, longitude);
      const now = new Date();
      // Compare in UTC to match the solar calculation
      const currentUTC = now.getUTCHours() + now.getUTCMinutes() / 60;
      setIsNight(currentUTC < sunriseUTC || currentUTC > sunsetUTC);
    };

    check();
    const interval = setInterval(check, 60 * 1000);
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return { isNight };
};
