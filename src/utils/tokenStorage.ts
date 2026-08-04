import * as Keychain from 'react-native-keychain';

const REFRESH_TOKEN_SERVICE = 'voita_refresh_token';

export async function storeRefreshToken(refreshToken: string) {
  await Keychain.setGenericPassword('refresh_token', refreshToken, {
    service: REFRESH_TOKEN_SERVICE,
  });
}

export async function getRefreshToken(): Promise<string | null> {
  const result = await Keychain.getGenericPassword({
    service: REFRESH_TOKEN_SERVICE,
  });
  return result ? result.password : null;
}

export async function clearRefreshToken() {
  await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_SERVICE });
}
