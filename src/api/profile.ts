const BASE_URL = 'https://voita-backend.fly.dev/api/v1';

// ==============================
// 🧑 USER PROFILE UPDATE
// ==============================
export const updateUserProfile = async (
  token: string,
  data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    profileImage?: string | null;
  },
) => {
  const formData = new FormData();

  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('phone', data.phone);
  formData.append('email', data.email);

  // Profile Image (safe)
  if (data.profileImage) {
    formData.append('profileImage', {
      uri: data.profileImage.startsWith('file://')
        ? data.profileImage
        : `file://${data.profileImage}`,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
  }

  const res = await fetch(`${BASE_URL}/profile/user`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      success: false,
      message: 'Invalid server response',
    };
  }
};

// Vehicle Profile Update

export const updateVehicleProfile = async (
  token: string,
  data: {
    numberPlate: string;
    vehicleType: string;
    year: string;
    color: string;
    oilType: string;
    tirePressure: string;
    tireConfig: string;
    insuranceRenewal?: string | null;
    drivingLicenseExpiry?: string | null;
    carServiceDate?: string | null;
    tireExpiryDate?: string | null;
  },
  vehicleImage: string | null,
) => {
  const formData = new FormData();

  // Basic fields (explicit mapping = safer)
  formData.append('numberPlate', data.numberPlate);
  formData.append('vehicleType', data.vehicleType);
  formData.append('year', String(data.year));
  formData.append('color', data.color);
  formData.append('oilType', data.oilType);
  formData.append('tirePressure', data.tirePressure);
  formData.append('tireConfig', data.tireConfig);

  // Dates (only if exist)
  if (data.insuranceRenewal)
    formData.append('insuranceRenewal', data.insuranceRenewal);

  if (data.drivingLicenseExpiry)
    formData.append('drivingLicenseExpiry', data.drivingLicenseExpiry);

  if (data.carServiceDate)
    formData.append('carServiceDate', data.carServiceDate);

  if (data.tireExpiryDate)
    formData.append('tireExpiryDate', data.tireExpiryDate);

  // Vehicle Image (safe)
  if (vehicleImage) {
    formData.append('vehicleImage', {
      uri: vehicleImage.startsWith('file://')
        ? vehicleImage
        : `file://${vehicleImage}`,
      type: 'image/jpeg',
      name: 'vehicle.jpg',
    } as any);
  }

  const res = await fetch(`${BASE_URL}/profile/vehicle`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch (e) {
    result = {
      success: false,
      message: 'Invalid server response',
    };
  }

  console.log('🔥 Vehicle API response:', result);

  return result;
};
