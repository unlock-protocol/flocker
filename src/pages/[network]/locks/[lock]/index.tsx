import { LocksmithService } from "@unlock-protocol/unlock-js";
import { NextPage, GetServerSideProps } from "next";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { app } from "../../../../config/app";
import {
  createCheckoutURL,
  isUserLockManager,
  ogUrl,
  TokenData,
} from "../../../../utils";
import { NextSeo } from "next-seo";
import { customizeSEO } from "../../../../config/seo";
import "urlpattern-polyfill";
import { Profile } from "../../../../components/Profile";
import { ProfileLinks } from "../../../../components/ProfileLinks";
import { useAuth } from "../../../../hooks/useAuth";
import { Navigation } from "../../../../components/Navigation";
import { BecomeMember } from "../../../../components/BecomeMember";
import { EditFlocker } from "../../../../components/EditFlocker";
import { useMembership } from "../../../../hooks/useMembership";
import { getLock, useLock } from "../../../../hooks/useLock";
import { ShareFlocker } from "../../../../components/ShareFlocker";
interface Props {
  network: number;
  lockAddress: string;
  tokenData: TokenData;
}

const getTwitterHandle = (link?: string) => {
  try {
    if (!link) {
      return;
    }
    const pattern = new URLPattern("https://twitter.com/:username");
    const matched = pattern.exec(link);
    return matched?.pathname.groups.username;
  } catch {}
};

const IndexPage: NextPage<Props> = ({ network, lockAddress, tokenData }) => {
  const { isAuthenticated, user } = useAuth();
  const { isMember, isLoading } = useMembership(network, lockAddress, user);
  const { data: lock } = useLock(network, lockAddress);

  const links = (tokenData.attributes || [])
    .filter(
      (item) =>
        typeof item.value === "string" &&
        !item.max_value &&
        item.value.startsWith("https://")
    )
    .reduce<Record<string, string>>((acc, item) => {
      acc[item.trait_type] = item.value?.toString();
      return acc;
    }, {});

  const isLockManager = isUserLockManager(lock, user);
  return (
    <div className="flex flex-col flex-1 h-screen">
      <NextSeo
        {...customizeSEO({
          description: tokenData.description,
          title: tokenData.name,
          imagePath: ogUrl(
            new URL(`/${network}/locks/${lock?.address}`, app.baseURL)
          ),
          twitter: {
            handle: getTwitterHandle(links.twitter),
            site: links.twitter,
          },
        })}
      />
      <Navigation />
      <ColumnLayout>
        <Profile
          name={tokenData.name}
          description={tokenData.description}
          imageURL={tokenData.image}
          externalURL={tokenData.external_url}
        />
        {isLockManager && <ShareFlocker network={137} address={lockAddress} />}
        {!isLockManager && !isMember && (
          <BecomeMember network={137} address={lockAddress} />
        )}
        <ProfileLinks hide={!isMember && !isLockManager} links={links} />
        {isLockManager && <EditFlocker network={137} address={lockAddress} />}
      </ColumnLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const lockAddress = ctx.query.lock?.toString();
  const network = Number(ctx.query.network);
  const service = new LocksmithService(undefined, app.locksmith);

  if (!lockAddress) {
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

      const lock = await getLock(network, lockAddress);
      if (!lock) {
        return {
          notFound: true,
        };
      }

      return {
        name: lock.name,
        attributes: [],
        description: "",
      };
    })
    .catch(async (error) => {
      console.error(error.message);
      // Can we get name from contract itself?
      const lock = await getLock(network, lockAddress);
      if (!lock) {
        return {
          notFound: true,
        };
      }
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
    },
  };
};

export default IndexPage;
