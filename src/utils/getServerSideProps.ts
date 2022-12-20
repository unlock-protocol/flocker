import { LocksmithService } from "@unlock-protocol/unlock-js";
import { GetServerSideProps } from "next";
import { app } from "../config/app";
import { getLock } from "../hooks/useLock";
import { ethers } from "ethers";

const getFlockProps: any = async (lockAddress: string, network: number) => {
  const service = new LocksmithService(undefined, app.locksmith);

  const lock = await getLock(network, lockAddress);

  if (!lock) {
    return {
      notFound: true,
    };
  }

  const tokenData = await service
    .lockMetadata(network, lockAddress!)
    .then((response) => {
      return response.data;
    })
    .catch(async (error) => {
      console.error(error.message);

      return {
        name: lock.name,
        attributes: [],
        description: "",
      };
    })
    .catch(async (error) => {
      console.error(error.message);
      return {
        name: lock.name,
        image: "DEFAULT",
        attributes: [],
        description: "",
      };
    });

  return {
    props: {
      // Serialize undefined into null
      tokenData: Object.entries(tokenData).reduce((acc, [key, value]) => {
        acc[key] = value || null;
        return acc;
      }, {} as any),
      lockAddress,
      network,
      lock,
    },
  };
};

// props for the "full" path /<network>/locks/<address>
export const flock: GetServerSideProps = async (ctx) => {
  const lockAddress = ctx.query.lock?.toString();
  const network = Number(ctx.query.network);

  if (!lockAddress || !network) {
    return {
      notFound: true,
    };
  }

  return getFlockProps(lockAddress, network);
};

// props for the "ens" path /<ens name>
// Let's resolve the ENS for `app.flocker`
export const ens: GetServerSideProps = async (ctx) => {
  const name = ctx.query.network;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.unlock-protocol.com/1"
  );
  const resolver = await provider.getResolver(`${name}.eth`);
  if (!resolver) {
    return {
      notFound: true,
    };
  }
  const flocker = await resolver.getText("app.flocker");
  const match = flocker.match(/eip155:([0-9]*):(0x[a-fA-F0-9]{40})/);
  if (!match || match.length == 0) {
    return {
      notFound: true,
    };
  }

  const network = match[1];
  const lockAddress = match[2];
  if (!network || !lockAddress) {
    return {
      notFound: true,
    };
  }

  return getFlockProps(lockAddress, parseInt(network, 10));
};
