import { LocksmithService } from "@unlock-protocol/unlock-js";
import { GetServerSideProps } from "next";
import { app } from "../config/app";
import { getLock } from "../hooks/useLock";

export const flock: GetServerSideProps = async (ctx) => {
  const lockAddress = ctx.query.lock?.toString();
  const network = Number(ctx.query.network);
  const service = new LocksmithService(undefined, app.locksmith);

  if (!lockAddress) {
    return {
      notFound: true,
    };
  }

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
