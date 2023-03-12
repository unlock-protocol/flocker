const APP_NAME = "flocker";

export const CURRENT_ACCOUNT_KEY = `${APP_NAME}.account`;

export const getSessionKey = (address: string) =>
  `${APP_NAME}.session_${address.trim().toLowerCase()}`;

export const getCurrentAccount = () => {
  return localStorage.getItem(CURRENT_ACCOUNT_KEY);
};

export const getAccessToken = (
  address: string | null = getCurrentAccount()
) => {
  if (!address) {
    return;
  }
  const ACCESS_TOKEN_KEY = getSessionKey(address);
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = (
  address: string | null = getCurrentAccount()
) => {
  if (!address) {
    return;
  }
  const ACCESS_TOKEN_KEY = getSessionKey(address);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const saveAccessToken = ({
  walletAddress,
  accessToken,
}: Record<"walletAddress" | "accessToken", string>) => {
  const ACCESS_TOKEN_KEY = getSessionKey(walletAddress);
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  return accessToken;
};
