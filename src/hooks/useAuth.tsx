import { useRouter } from "next/router";
import { useEffect, useCallback, useState } from "react";
import { ethers } from "ethers";
import { LocksmithService } from "@unlock-protocol/unlock-js";
import { storage } from "../config/storage";
import { app } from "../config/app";
import {
  CURRENT_ACCOUNT_KEY,
  removeAccessToken,
  saveAccessToken,
} from "../utils/session";
import { useSession } from "./useSession";

export function useAuth() {
  const router = useRouter();
  const code = router.query?.code?.toString();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const { data: user, refetch: refetchUser } = useSession();
  const isAuthenticated = !!user;

  const authenticate = useCallback(
    async (_code: string) => {
      const code = JSON.parse(Buffer.from(_code, "base64").toString());
      const message = code.d;
      const signature = code.s;
      const user = ethers.utils.verifyMessage(message, signature);
      const service = new LocksmithService(undefined, app.locksmith);
      const response = await service.login({
        message,
        signature,
      });

      if (response.status !== 200) {
        throw new Error("Failed to login. Try again");
      }

      const { accessToken, walletAddress } = response.data;
      localStorage.setItem(CURRENT_ACCOUNT_KEY, walletAddress!);
      saveAccessToken({
        accessToken,
        walletAddress: walletAddress!,
      });

      await refetchUser();
      return {
        message,
        signature,
        accessToken,
        user,
      };
    },
    [refetchUser]
  );

  useEffect(() => {
    if (!code) {
      setIsAuthenticating(false);
      return;
    }
    const onCode = async () => {
      setIsAuthenticating(true);
      try {
        // We just need to remove the code!
        const url = new URL(window.location.toString());
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        router.replace(url.toString(), undefined, {
          shallow: true,
        });
        await authenticate(code);
      } catch (error) {
        console.error(error);
      }
      setIsAuthenticating(false);
    };
    onCode();
  }, [router, code, authenticate]);

  interface LoginParams {
    [key: string]: string;
  }

  const login = (params: LoginParams = {}) => {
    const url = new URL("https://app.unlock-protocol.com/checkout");
    url.searchParams.set("client_id", window.location.host);
    const redirectUri = new URL(window.location.href);
    Object.keys(params).forEach((key) => {
      redirectUri.searchParams.set(key, params[key]);
    });
    url.searchParams.set("redirect_uri", redirectUri.toString());
    window.location.href = url.toString();
  };

  const logout = async () => {
    await storage.revoke().catch(console.error);
    removeAccessToken();
    await refetchUser();
  };

  return {
    user,
    storage,
    login,
    logout,
    isAuthenticated,
    isAuthenticating,
  };
}
