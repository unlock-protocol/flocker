import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

export function useMembership(
  network: number,
  lockAddress: string,
  userAddress: string
) {
  const query = useQuery(
    ["key", network, lockAddress, userAddress],
    async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://rpc.unlock-protocol.com/${network}`
      );
      if (!lockAddress || !userAddress) {
        return false;
      }

      const lock = new ethers.Contract(
        lockAddress,
        [
          {
            inputs: [
              { internalType: "address", name: "_keyOwner", type: "address" },
            ],
            name: "getHasValidKey",
            outputs: [{ internalType: "bool", name: "isValid", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        provider
      );
      return await lock.getHasValidKey(userAddress);
    }
  );

  return {
    isMember: query.data,
    isLoading: query.isLoading,
  };
}
