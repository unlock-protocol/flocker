import { NextPage, GetServerSideProps } from "next";
import {
  isUserLockManager,
  TokenData,
  linksFromTokenData,
} from "../../../../utils";
import "urlpattern-polyfill";
import { ProfileLinks } from "../../../../components/ProfileLinks";
import { useAuth } from "../../../../hooks/useAuth";
import { BecomeMember } from "../../../../components/BecomeMember";
import { EditFlocker } from "../../../../components/EditFlocker";
import { useMembership } from "../../../../hooks/useMembership";
import { ShareFlocker } from "../../../../components/ShareFlocker";
import { flock } from "../../../../utils/getServerSideProps";
import FlockHead from "../../../../components/FlockHead";

interface Props {
  network: number;
  lockAddress: string;
  tokenData: TokenData;
  lock: any;
}

export const IndexPage: NextPage<Props> = ({
  network,
  lockAddress,
  tokenData,
  lock,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { isMember, isLoading } = useMembership(network, lockAddress, user);

  const links = linksFromTokenData(tokenData);

  const isLockManager = isUserLockManager(lock, user);

  return (
    <FlockHead
      tokenData={tokenData}
      network={network}
      lock={lock}
      links={links}
    >
      {isLockManager && <ShareFlocker network={137} address={lockAddress} />}
      {!isLockManager && !isMember && (
        <BecomeMember network={137} address={lockAddress} />
      )}
      <ProfileLinks hide={!isMember && !isLockManager} links={links} />
      {isLockManager && <EditFlocker network={137} address={lockAddress} />}
    </FlockHead>
  );
};

export const getServerSideProps: GetServerSideProps = flock;

export default IndexPage;
