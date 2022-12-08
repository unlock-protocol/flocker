import { SubgraphService } from "@unlock-protocol/unlock-js";
import { useQuery } from "@tanstack/react-query";
import networks from "@unlock-protocol/networks";

export const getLock = async (network: number, address: string) => {
  const subgraph = new SubgraphService(networks);
  if (!address || !network) {
    return null;
  }
  return subgraph.lock(
    {
      where: {
        address,
      },
    },
    {
      network,
    }
  );
};

export function useLock(network: number, lockAddress: string) {
  return useQuery(["lock", network, lockAddress], async () => {
    return getLock(network, lockAddress);
  });
}
