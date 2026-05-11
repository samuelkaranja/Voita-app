const BASE_URL = 'https://voita-backend.fly.dev/api/v1';

export const getProfile = async (token: string) => {
  const res = await fetch(`${BASE_URL}/profile/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const updateProfile = async (token: string, data: any) => {
  const res = await fetch(`${BASE_URL}/profile/user/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateVehicle = async (
  token: string,
  vehicleId: string,
  data: any,
) => {
  const res = await fetch(
    `${BASE_URL}/profile/vehicle/${vehicleId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return res.json();
};


