import { networks } from "@unlock-protocol/networks";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { configureChains, Chain, createClient } from "wagmi";

const chains = Object.values(networks).map((network: any) => {
  const chain: Chain = {
    id: network.id,
    network: network.id,
    rpcUrls: {
      default: network.provider,
    },
    name: network.name,
    nativeCurrency: network.nativeCurrency,
    testnet: network.isTestnet,
  };
  return chain;
});

const { provider } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: chain.rpcUrls.default,
    }),
  }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
});
