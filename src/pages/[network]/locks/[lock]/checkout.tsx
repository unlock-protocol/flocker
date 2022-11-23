import { LocksmithService } from "@unlock-protocol/unlock-js";
import { GetServerSideProps, NextPage } from "next";
import { app } from "../../../../config/app";
import { createCheckoutURL, TokenData } from "../../../../utils";

const Checkout: NextPage = () => {
  return <div> Redirecting...</div>;
};

export default Checkout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const lock = ctx.query.lock!.toString();
  const network = Number(ctx.query.network);
  const service = new LocksmithService(undefined, app.locksmith);
  const response = await service
    .lockMetadata(network, lock!)
    .catch(console.error);
  const tokenData = response?.data as TokenData | undefined;

  const checkoutURL = createCheckoutURL({
    network,
    lock,
    icon: tokenData?.image,
    title: tokenData?.name,
  });
  return {
    redirect: {
      permanent: true,
      destination: checkoutURL,
    },
  };
};
