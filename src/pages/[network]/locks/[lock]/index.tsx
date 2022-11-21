import { LocksmithService } from "@unlock-protocol/unlock-js";
import { NextPage, GetServerSideProps } from "next";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { LinkButton } from "../../../../components/LinkButton";
import { app } from "../../../../config/app";
import { createCheckoutURL, ogUrl, TokenData } from "../../../../utils";
import {
  SiSubstack as SubstackIcon,
  SiDiscord as DiscordIcon,
  SiInstagram as InstagramIcon,
  SiMastodon as MastodonIcon,
  SiTwitter as TwitterIcon,
} from "react-icons/si";
import { FiLink as LinkIcon } from "react-icons/fi";
import { NextSeo } from "next-seo";
import { customizeSEO } from "../../../../config/seo";
import "urlpattern-polyfill";
import { Profile } from "../../../../components/Profile";
import { ProfileLink } from "../../../../components/ProfileLink";
interface Props {
  network: number;
  lock: string;
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

const IndexPage: NextPage<Props> = ({ network, lock, tokenData }) => {
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

  const checkoutURL = createCheckoutURL({
    network,
    lock,
  });

  return (
    <div className="flex flex-col flex-1 h-screen">
      <NextSeo
        {...customizeSEO({
          description: tokenData.description,
          title: tokenData.name,
          imagePath: ogUrl(new URL(`/${network}/locks/${lock}`, app.baseURL)),
          twitter: {
            handle: getTwitterHandle(links.twitter),
            site: links.twitter,
          },
        })}
      />
      <nav className="sticky top-0 z-30 bg-opacity-75 border-b border-gray-100 backdrop-blur backdrop-filter firefox:bg-opacity-90">
        <div className="flex justify-end w-full max-w-2xl p-2 mx-auto">
          <button
            className="inline-flex items-center px-4 py-2 font-bold text-white bg-gray-900 rounded-full hover:bg-gray-800"
            onClick={(event) => {
              event.preventDefault();
              window.open(checkoutURL.toString());
            }}
          >
            Claim membership
          </button>
        </div>
      </nav>
      <ColumnLayout>
        <Profile
          name={tokenData.name}
          description={tokenData.description}
          imageURL={tokenData.image}
        />
        <ProfileLink
          twitter={links.twitter}
          mastodon={links.mastodon}
          instagram={links.instagram}
          discord={links.discord}
          website={links.website}
          other={links.other}
          substack={links.substack}
        />
      </ColumnLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const lock = ctx.query.lock?.toString();
    const network = Number(ctx.query.network);
    const service = new LocksmithService(undefined, app.locksmith);
    const response = await service.lockMetadata(network, lock!);
    const tokenData = response.data;
    return {
      props: {
        // Serialize undefined into null
        tokenData: Object.entries(tokenData).reduce((acc, [key, value]) => {
          acc[key] = value || null;
          return acc;
        }, {} as any),
        lock,
        network,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default IndexPage;
