import { useEffect, useState } from "react";

export const useTraffic = (location: any) => {
  const [traffic, setTraffic] = useState(null);

  useEffect(() => {
    if (!location) return;

    // replace with real API call
    setTraffic("Moderate");
  }, [location]);

  return traffic;
};
