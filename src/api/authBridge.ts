type Auth = { token: string | null; tokenExpiresAt: number | null };

let _getAuth: () => Auth = () => ({ token: null, tokenExpiresAt: null });
let _refresh: () => Promise<any> = async () => {
  throw new Error('authBridge not wired');
};
let _logout: () => void = () => {};

export const wireAuthBridge = (fns: {
  getAuth: () => Auth;
  refresh: () => Promise<any>;
  logout: () => void;
}) => {
  _getAuth = fns.getAuth;
  _refresh = fns.refresh;
  _logout = fns.logout;
};

export const authBridge = {
  getAuth: () => _getAuth(),
  refresh: () => _refresh(),
  logout: () => _logout(),
};
