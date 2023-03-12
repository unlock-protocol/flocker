import { useQuery } from "@tanstack/react-query";
import { storage } from "../config/storage";
import { AxiosError } from "axios";
import {
  getAccessToken,
  getCurrentAccount,
  removeAccessToken,
} from "../utils/session";

export const useSession = () => {
  return useQuery(
    ["session"],
    async () => {
      try {
        const response = await storage.user();
        return response.data!.walletAddress;
      } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
          removeAccessToken();
          return null;
        }
        const session = getAccessToken();
        if (session) {
          return getCurrentAccount();
        }
        return null;
      }
    },
    {
      staleTime: 60 * 10 * 1000,
      refetchInterval: 60 * 10 * 1000,
      retry: 3,
      retryDelay: 1000,
    }
  );
};
