import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import FlockHead from "../../../../components/FlockHead";
import { Members } from "../../../../components/Members";
import { useMembers } from "../../../../hooks/useMembers";
import { linksFromTokenData, TokenData } from "../../../../utils";
import { flock } from "../../../../utils/getServerSideProps";

interface Props {
  network: number;
  lockAddress: string;
  tokenData: TokenData;
  lock: any;
}

const MembersPage: NextPage<Props> = ({
  network,
  lockAddress,
  tokenData,
  lock,
}) => {
  const router = useRouter();
  const page = parseInt(router.query?.page?.toString() || "1", 10);
  const links = linksFromTokenData(tokenData);

  return (
    <FlockHead
      tokenData={tokenData}
      network={network}
      lock={lock}
      links={links}
    >
      <Members network={network} lock={lock} page={page} />
    </FlockHead>
  );
};

export const getServerSideProps: GetServerSideProps = flock;

export default MembersPage;
