import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { useAuth } from "../hooks/useAuth";
import { SiTwitter as TwitterIcon } from "react-icons/si";
// @ts-expect-error - no typings.
import ReCaptcha from "react-google-recaptcha";
import { app } from "../config/app";
import { useMutation } from "@tanstack/react-query";
import { LocksmithService, WalletService } from "@unlock-protocol/unlock-js";
import { networks } from "@unlock-protocol/networks";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FiExternalLink as ExternalLinkIcon } from "react-icons/fi";
import { minifyAddress } from "../utils";
import { LockAddress } from "./LockAddress";

export function ContractDeployBox() {
  const { user, storage } = useAuth();
  const [username, setUsername] = useState("");
  const [network] = useState(app.defaultNetwork);
  const isDeployDisabled = !(username.length >= 2);
  const router = useRouter();
  const recaptchaRef = useRef<any>();
  const {
    isLoading: isContractDeploying,
    mutate: deployContract,
    data: lockContract,
  } = useMutation({
    mutationKey: ["contract", username],
    mutationFn: async (
      options: Parameters<
        InstanceType<typeof LocksmithService>["createLockContract"]
      >[2]
    ) => {
      const reCaptchaValue = await recaptchaRef.current?.executeAsync();
      const walletService = new WalletService(networks);
      const provider = walletService.providerForNetwork(network);

      const response = await storage.createLockContract(
        network,
        reCaptchaValue!,
        options
      );
      const { transactionHash } = response.data;

      if (!transactionHash) {
        return {
          address: null,
          network,
          status: -1,
        };
      }

      await walletService.connect(provider, ethers.Wallet.createRandom());
      const contract = await walletService.getUnlockContract();
      const { logs, status } = await provider.waitForTransaction(
        transactionHash
      );

      const parser = contract.interface;

      const newLockEvent = logs
        .map((log) => {
          try {
            // ignore events that we can not parse
            return parser.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((event) => event && event.name === "NewLock")[0];

      if (!newLockEvent) {
        return {
          address: null,
          network,
          status,
        };
      }

      return {
        address: newLockEvent.args.newLockAddress,
        network,
        status,
      };
    },
    onError(error: Error) {
      console.error(error);
      toast.error(error?.message);
    },
  });

  return (
    <div>
      <ReCaptcha
        ref={recaptchaRef}
        sitekey={app.recaptchaKey}
        size="invisible"
      />

      {lockContract ? (
        <div className="inset-0 grid gap-2 p-4 bg-white shadow-2xl rounded-xl shadow-blue-200">
          <div className="font-bold">{username}</div>
          <LockAddress
            lockAddress={lockContract.address}
            network={lockContract.network}
          />
          <Button
            onClick={(event) => {
              event.preventDefault();
              router.push(
                `/${network}/locks/${lockContract.address}/edit?username=${username}`
              );
            }}
          >
            Edit Attributes
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          <Input
            label="Your twitter username"
            icon={<TwitterIcon size={20} />}
            value={username}
            disabled={isContractDeploying}
            onChange={(event) => {
              event.preventDefault();
              const value = event.target.value;
              setUsername(value);
            }}
          />
          <Button
            loading={isContractDeploying}
            disabled={isDeployDisabled}
            onClick={() => {
              deployContract({
                creator: user,
                name: username,
                keyPrice: "0",
              });
            }}
          >
            Deploy membership contract
          </Button>
        </div>
      )}
    </div>
  );
}
