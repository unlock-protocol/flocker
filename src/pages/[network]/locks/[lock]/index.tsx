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
  SiTwitter as TwitterIcon,
} from "react-icons/si";
import { FiLink as LinkIcon } from "react-icons/fi";
import NextImage from "next/image";
import fontColorContrast from "font-color-contrast";
import { Button } from "../../../../components/Button";
import { NextSeo } from "next-seo";
import { customizeSEO } from "../../../../config/seo";
import "urlpattern-polyfill";
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

  const backgroundColor =
    tokenData.background_color && tokenData.background_color?.startsWith("#")
      ? tokenData.background_color
      : `#${tokenData.background_color}`;

  const contrast = fontColorContrast(backgroundColor || "#FFFFFF");
  const checkoutURL = createCheckoutURL({
    network,
    lock,
  });

  return (
    <div
      className="h-screen"
      style={{
        backgroundColor,
      }}
    >
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
      <nav className="flex justify-end w-full max-w-2xl p-6 mx-auto">
        <button
          className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-full cursor-pointer hover:bg-opacity-75 disabled:hover:bg-opacity-75 disabled:bg-opacity-75 disabled:cursor-not-allowed"
          style={{
            backgroundColor: contrast,
            color: fontColorContrast(contrast),
          }}
          onClick={(event) => {
            event.preventDefault();
            window.open(checkoutURL.toString());
          }}
        >
          Claim membership
        </button>
      </nav>
      <ColumnLayout className="max-w-xl pt-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            {tokenData.image && (
              <NextImage
                src={tokenData.image}
                height={120}
                width={120}
                className="border border-gray-100 rounded-full"
                alt={tokenData.name}
              />
            )}
            {tokenData.name && (
              <h1
                style={{
                  color: contrast,
                }}
                className="text-xl font-bold sm:text-3xl"
              >
                {tokenData.name}
              </h1>
            )}
          </div>
          {tokenData.description && (
            <p
              style={{
                color: contrast,
              }}
              className="text-lg"
            >
              {tokenData.description}
            </p>
          )}
        </header>
        <div className="grid gap-6 pt-16">
          {links.twitter && (
            <LinkButton
              icon={<TwitterIcon />}
              href={links.twitter}
              label="Follow me on twitter"
            />
          )}
          {links.website && (
            <LinkButton
              icon={<LinkIcon />}
              href={links.website}
              label="My website"
            />
          )}
          {links.substack && (
            <LinkButton
              icon={<SubstackIcon />}
              href={links.substack}
              label="Read my blog posts"
            />
          )}
          {links.instagram && (
            <LinkButton
              icon={<InstagramIcon />}
              href={links.instagram}
              label="Check out instagram"
            />
          )}
          {links.discord && (
            <LinkButton
              icon={<DiscordIcon />}
              href={links.discord}
              label="Join my discord"
            />
          )}
        </div>
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
