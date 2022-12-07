import { SubgraphService } from "@unlock-protocol/unlock-js";
import { useQuery } from "@tanstack/react-query";
import networks from "@unlock-protocol/networks";

export function useLock(network: number, lockAddress: string) {
  return useQuery(["lock", network, lockAddress], async () => {
    const subgraph = new SubgraphService(networks);
    if (!lockAddress) {
      return {};
    }
    return subgraph.lock(
      {
        where: {
          address: lockAddress,
        },
      },
      {
        network,
      }
    );
  });
}
