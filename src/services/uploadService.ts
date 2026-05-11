const BASE_URL = 'https://voita-backend.fly.dev/api/v1';

export const uploadImage = async (
  token: string,
  image: any,
  folder: string,
) => {
  try {
    const formData = new FormData();

    // 🔑 IMPORTANT for React Native
    const file = {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || `upload_${Date.now()}.jpg`,
    };

    formData.append('file', file as any);
    formData.append('folder', folder);

    const response = await fetch(`${BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type manually
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data; // { success, url, ... }
  } catch (error: any) {
    console.log('UPLOAD ERROR:', error);
    throw error;
  }
};
