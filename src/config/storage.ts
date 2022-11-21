import { LocksmithService } from "@unlock-protocol/unlock-js";
import axios from "axios";
import { app } from "./app";
import { createLocalStorageValue } from "../utils";
const [getAccessToken, setAccessToken] = createLocalStorageValue("accessToken");
const [getRefreshToken, setRefreshToken] =
  createLocalStorageValue("refreshToken");
const [_, setUser] = createLocalStorageValue("user");

export const client = axios.create();

client.interceptors.request.use((config) => {
  let accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (accessToken && refreshToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalConfig = err.config;
    const refreshToken = getRefreshToken();
    if ([401].includes(err.response?.status) && refreshToken) {
      try {
        originalConfig.sent = true;
        const service = new LocksmithService(undefined, app.locksmith);
        const response = await service.refreshToken(undefined, {
          refreshToken,
        });

        // If request is unsuccessful with refresh token, we logout the user since refresh token has expired or is invalid.
        if (response.status !== 200) {
          setRefreshToken("");
          setAccessToken("");
          setUser("");
          return err;
        }

        const { accessToken, walletAddress } = response.data;
        setAccessToken(accessToken);
        setUser(walletAddress);

        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return client(originalConfig);
      } catch (_error: any) {
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data);
        }
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  }
);

export const storage = new LocksmithService(undefined, app.locksmith, client);
