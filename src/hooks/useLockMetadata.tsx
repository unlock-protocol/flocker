import { useQuery } from "@tanstack/react-query";
import { storage } from "../config/storage";
import { toFormData, TokenData } from "../utils";
import { useAuth } from "./useAuth";

interface Options {
  lockAddress?: string;
  network: number;
}

export const useLockMetadata = (options: Options) => {
  const query = useQuery(
    ["metadata", options.lockAddress, options.network],
    async () => {
      const response = await storage.lockMetadata(
        options.network,
        options.lockAddress!
      );
      const data = toFormData(response.data as TokenData);
      return data;
    },
    {
      onError(error: Error) {
        console.error(error);
      },
      retry: false,
      refetchOnMount: true,
      enabled: !!(options.lockAddress && options.network),
    }
  );
  return query;
};
