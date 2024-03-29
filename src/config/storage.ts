import { LocksmithService } from "@unlock-protocol/unlock-js";
import axios, { AxiosHeaders } from "axios";
import { app } from "./app";
import { getAccessToken } from "../utils/session";

export const client = axios.create();

client.interceptors.request.use((config) => {
  let accessToken = getAccessToken();
  if (accessToken) {
    config.headers = AxiosHeaders.concat(config.headers, {
      Authorization: `Bearer ${accessToken}`,
    });
  }
  return config;
});

export const storage = new LocksmithService(undefined, app.locksmith, client);
