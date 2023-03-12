import { useRef, useState } from "react";
import { Button } from "./Button";
import { useAuth } from "../hooks/useAuth";
// @ts-expect-error - no typings.
import ReCaptcha from "react-google-recaptcha";
import { app } from "../config/app";
import { useMutation } from "@tanstack/react-query";
import { LocksmithService, Web3Service } from "@unlock-protocol/unlock-js";
import { networks } from "@unlock-protocol/networks";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { LockAddress } from "./LockAddress";

interface ContractDeployBoxProps {
  twitterUsername: string;
}

export function ContractDeployBox({ twitterUsername }: ContractDeployBoxProps) {
  const { user, storage } = useAuth();
  const [network] = useState(app.defaultNetwork);
  const router = useRouter();
  const recaptchaRef = useRef<any>();
  const {
    isLoading: isContractDeploying,
    mutate: deployContract,
    data: lockContract,
  } = useMutation({
    mutationKey: ["contract", twitterUsername],
    mutationFn: async (
      options: Parameters<
        InstanceType<typeof LocksmithService>["createLockContract"]
      >[2]
    ) => {
      const reCaptchaValue = await recaptchaRef.current?.executeAsync();
      const web3Service = new Web3Service(networks);
      const provider = web3Service.providerForNetwork(network);

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
      const contract = await web3Service.getUnlockContract(
        networks[network].unlockAddress,
        provider
      );
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
        <div>
          <div className="inset-0 grid gap-6 p-4 bg-white shadow-2xl rounded-xl shadow-blue-200">
            <p className="mt-4 text-lg ">
              🎉 You successfully created a contract. Let&apos;s configure your
              flocker links!
            </p>
            <LockAddress
              lockAddress={lockContract.address}
              network={lockContract.network}
            />
            <Button
              onClick={(event) => {
                event.preventDefault();
                router.push(
                  `/${network}/locks/${lockContract.address}/edit?username=${twitterUsername}`
                );
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <p>
            Are you ready? We will now create your membership contract on
            Polygon. It should take less than 1 minute.
          </p>
          <Button
            loading={isContractDeploying}
            onClick={() => {
              deployContract({
                expirationDuration: (60 * 60 * 24 * 30).toString(), // 1 month!
                creator: user,
                name: `@${twitterUsername}`,
                keyPrice: "0", // Free by default!
              });
            }}
          >
            Create membership contract
          </Button>
        </div>
      )}
    </div>
  );
}
