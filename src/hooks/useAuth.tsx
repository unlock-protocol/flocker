import { useRouter } from "next/router";
import { useEffect, useMemo, useCallback, useState } from "react";
import { ethers } from "ethers";
import useLocalStorageState from "use-local-storage-state";
import { LocksmithService } from "@unlock-protocol/unlock-js";
import { storage } from "../config/storage";
import { app } from "../config/app";

export function useAuth() {
  const router = useRouter();
  const code = router.query?.code?.toString();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useLocalStorageState("user", {
    defaultValue: "",
  });

  const [accessToken, setAccessToken] = useLocalStorageState("accessToken", {
    defaultValue: "",
  });

  const [refreshToken, setRefreshToken] = useLocalStorageState("refreshToken", {
    defaultValue: "",
  });

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

      const { refreshToken, accessToken } = response.data;

      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      setUser(user);

      return {
        message,
        signature,
        refreshToken,
        accessToken,
        user,
      };
    },
    [setAccessToken, setRefreshToken, setUser]
  );

  useEffect(() => {
    if (!code) {
      return;
    }
    const onCode = async () => {
      setIsAuthenticating(true);
      try {
        router.replace(window.location.pathname, undefined, {
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

  const login = () => {
    let url = new URL("https://app.unlock-protocol.com/checkout");
    url.searchParams.set("client_id", window.location.host);
    url.searchParams.set("redirect_uri", window.location.href);
    window.location.href = url.toString();
  };

  const logout = () => {
    setUser("");
    setAccessToken("");
    setRefreshToken("");
  };

  return {
    user,
    accessToken,
    refreshToken,
    storage,
    login,
    logout,
    isAuthenticated,
    isAuthenticating,
  };
}
