import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button } from "../../../../components/Button";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { Navigation } from "../../../../components/Navigation";
import { createCheckoutURL } from "../../../../utils";
import NextImage from "next/image";

const partners = [
  {
    name: "Paragraph",
    url: "https://paragraph.xyz/",
    description: `
        Paragraph is a service for Web3-powered newsletters where you can write
        content, grow your audience and foster a community. No matter if your
        readers are on web2 or web3, Paragraph turns your subscribers into
        members.`,
    youtube: "https://www.youtube.com/embed/KaMVpOnZveE",
  },
  {
    name: "Highlight",
    url: "https://highlight.xyz/",
    description: `
        Highlight is an end-to-end toolkit to bring web3 membership and rewards
        to your fanbase, with no crypto experience required. In minutes, anyone
        can build a custom-branded community home, with rich integrations that
        offer ongoing utility and exclusive access.`,
    youtube: "https://www.youtube.com/embed/LEfQ8zGWT4c",
  },
  {
    name: "Geneva",
    url: "http://geneva.com",
    description: `Geneva is where your group chats, and gives you everything you need to
        keep your groups, clubs, and communities organized and connected.`,
    youtube: "https://www.youtube.com/embed/c1WKFrrf2QY",
  },
  {
    name: "Tropee",
    url: "https://www.tropee.com/",
    description:
      "Tropee is a collection of utilities you can use to create events, content, raffles, and more for your members.",
    youtube: "https://www.youtube.com/embed/7Mg6sif6iYI",
  },
  {
    name: "Discord",
    url: "https://unlock-protocol.com/blog/guildxyz-launch",
    description: `Discord is the easiest way to talk over voice, video, and text. Talk,
        chat, hang out, and stay close with your friends and communities. Token gate your discord community with guild.xyz`,
    youtube: null,
  },
  {
    name: "Telegram",
    url: "https://unlock-protocol.com/guides/how-to-token-gate-telegram-with-unlock-protocol-and-guild-xyz/",
    description:
      "Telegram is a globally-accessible messaging and chat service. Token gate your telegram community with guild.xyz",
    youtube: null,
  },
  {
    name: "WordPress",
    url: "https://wordpress.org/plugins/pmpro-unlock/",
    description: (
      <p>
        WordPress powers 43% of websites. You can create members-only areas for
        WordPress sites using the{" "}
        <a href="https://wordpress.org/plugins/unlock-protocol/">
          Unlock WordPress plugin
        </a>{" "}
        or{" "}
        <a href="https://wordpress.org/plugins/pmpro-unlock/">
          PaidMembershipsPro
        </a>
        .
      </p>
    ),
    image:
      "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/98f1e958-db98-4b2f-ba99-1fdde2d5b0a5/Screen_Shot_2022-11-19_at_12.33.40_PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221121%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221121T174555Z&X-Amz-Expires=86400&X-Amz-Signature=4c9d8d978dc003dbc2095cd6be988a9e6ad6920081e39ba51fc36734a78b2c13&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Screen%2520Shot%25202022-11-19%2520at%252012.33.40%2520PM.png%22&x-id=GetObject",
  },
];

const NextPage: NextPage = () => {
  const router = useRouter();
  const lock = router.query.lock?.toString();
  const network = Number(router.query.network);

  const checkoutURL = useMemo(() => {
    if (lock && network) {
      return createCheckoutURL({
        network,
        lock,
      });
    }
  }, [lock, network]);

  const shareUrl = useMemo<string>(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set(
      "text",
      "Claim a free membership from me and follow me anywhere on the web!\n\n"
    );
    if (checkoutURL) {
      url.searchParams.set("url", checkoutURL);
    }
    if (checkoutURL) {
      url.searchParams.set("via", "unlockProtocol");
    }
    return url.toString();
  }, [checkoutURL]);

  return (
    <div>
      <Navigation />
      <ColumnLayout>
        <header className="box-border flex flex-col max-w-2xl gap-4 pb-6 mx-auto">
          <h1 className="text-3xl font-bold sm:text-5xl">What&apos;s next?</h1>
          <h2 className="block text-lg text-gray-500 sm:text-xl">
            Share this link with your followers for them to claim your
            membership!
          </h2>
        </header>
        <div className="grid gap-6">
          {checkoutURL && (
            <a
              className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-blue-500 rounded-full cursor-pointer hover:bg-opacity-75 disabled:hover:bg-opacity-75 disabled:bg-opacity-75 disabled:cursor-not-allowed"
              target="_blank"
              href={shareUrl}
              rel="noopener noreferrer"
            >
              Share on Twitter
            </a>
          )}
        </div>

        <article className="pt-16 prose md:prose-lg">
          <p>
            You now have your own membership list that can never be taken away
            from you. And, as a bonus, you and your fans and followers — your
            members — can go anywhere together.
          </p>
          <p>
            Your contract (it&apos;s called a <em>lock</em>) was deployed on the{" "}
            <a href="https://polygon.technology/">Polygon</a> blockchain at the
            following address and nobody can take it from you:
          </p>
          <pre>{lock}</pre>
          <p>
            You can also modify your contract and list all members by using{" "}
            <a href="https://app.unlock-protocol.com/locks">
              Unlock&apos;s dashboard
            </a>
            .
          </p>

          <p>
            There are a number of sites and services available today you can use
            to set up new (or additional) outposts where you connect with your
            fans and followers. That membership list you made above using
            Flocker? By pointing any of the services below at your membership
            list, your members can reach you on any of these services. No
            middleman. No gatekeeper. No chaos monkey to take them away from
            you.
          </p>
        </article>
        <div className="grid gap-6 pt-12">
          {partners.map((partner, i) => {
            return (
              <section
                className="grid gap-6 p-6 bg-white shadow rounded-xl"
                key={i}
              >
                <div className="space-y-2">
                  <a
                    className="px-4 py-1 text-xl font-bold rounded hover:bg-gray-100 bg-gray-50"
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {partner.name}
                  </a>
                  <div className="text-gray-600">{partner.description}</div>
                </div>
                {partner.youtube && (
                  <iframe
                    className="w-full rounded aspect-video"
                    src={partner.youtube}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                )}
                {partner.image && (
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full rounded aspect-video"
                  />
                )}
              </section>
            );
          })}
        </div>
      </ColumnLayout>
    </div>
  );
};

export default NextPage;
