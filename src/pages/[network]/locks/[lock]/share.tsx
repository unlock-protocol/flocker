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
    description: (
      <p>
        Paragraph is a service for Web3-powered newsletters where you can write
        content, grow your audience and foster a community. No matter if your
        readers are on web2 or web3, Paragraph turns your subscribers into
        members.
      </p>
    ),
    youtube: "https://www.youtube.com/embed/KaMVpOnZveE",
  },
  {
    name: "Highlight",
    url: "https://highlight.xyz/",
    description: (
      <p>
        Highlight is an end-to-end toolkit to bring web3 membership and rewards
        to your fanbase, with no crypto experience required. In minutes, anyone
        can build a custom-branded community home, with rich integrations that
        offer ongoing utility and exclusive access.
      </p>
    ),
    youtube: "https://www.youtube.com/embed/LEfQ8zGWT4c",
  },
  {
    name: "Geneva",
    url: "http://geneva.com",
    description: (
      <p>
        Geneva is where your group chats, and gives you everything you need to
        keep your groups, clubs, and communities organized and connected.{" "}
      </p>
    ),
    youtube: "https://www.youtube.com/embed/c1WKFrrf2QY",
  },
  {
    name: "Tropee",
    url: "https://www.tropee.com/",
    description: (
      <p>
        Tropee is a collection of utilities you can use to create events,
        content, raffles, and more for your members.{" "}
      </p>
    ),
    youtube: "https://www.youtube.com/embed/7Mg6sif6iYI",
  },
  {
    name: "Discord",
    url: "https://unlock-protocol.com/blog/guildxyz-launch",
    description: (
      <p>
        Discord is the easiest way to talk over voice, video, and text. Talk,
        chat, hang out, and stay close with your friends and communities. Here
        is the{" "}
        <a href="https://unlock-protocol.com/blog/guildxyz-launch">
          how-to guide on How To Use Unlock Protocol Memberships with Discord
        </a>{" "}
        (in conjunction with Guild.xyz).{" "}
      </p>
    ),
    image:
      "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/424de92c-2594-4f65-a7cf-50742359e631/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221121%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221121T174341Z&X-Amz-Expires=86400&X-Amz-Signature=2f84b27bf936dbbb038fbbcd4a3ef3ff7a41116e85f7a1741363126161d160cd&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject",
  },
  {
    name: "Telegram",
    url:
      "https://unlock-protocol.com/guides/how-to-token-gate-telegram-with-unlock-protocol-and-guild-xyz/",
    description: (
      <p>
        Telegram is a globally-accessible messaging and chat service. Here is
        the how-to guide on{" "}
        <a href="https://unlock-protocol.com/guides/how-to-token-gate-telegram-with-unlock-protocol-and-guild-xyz/">
          How To Use Unlock Protocol Memberships with Telegram
        </a>
        (in conjunction with Guild.xyz).
      </p>
    ),
    image:
      "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/25b15553-e215-4859-944c-aeb69c0f5129/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221121%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221121T174401Z&X-Amz-Expires=86400&X-Amz-Signature=294d1d22b9aa6c371774d41bb394fa78d45f0069bcdda872d490b955a0728198&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject",
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
        </a>
        , or with{" "}
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
      <ColumnLayout className="pt-12">
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
              className="inline-flex bg-blue-500 hover:bg-opacity-75 disabled:hover:bg-opacity-75 disabled:hover:bg-opacity-75 rounded-full justify-center cursor-pointer text-white font-medium px-4 py-2 items-center gap-2 disabled:bg-opacity-75 disabled:cursor-not-allowed"
              target="_blank"
              href={shareUrl}
              rel="noopener noreferrer"
            >
              Share on Twitter
            </a>
          )}
        </div>

        <article className="prose mt-16">
          <p className="text-lg">
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

          {partners.map((partner, i) => {
            return (
              <section key={i}>
                <h2>
                  <a href={partner.url} target="_blank" rel="noreferrer">
                    {partner.name}
                  </a>
                </h2>
                {partner.description}
                {partner.youtube && (
                  <iframe
                    width="560"
                    height="315"
                    src={partner.youtube}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                )}
                {partner.image && (
                  <NextImage
                    src={partner.image}
                    height={315}
                    width={560}
                    alt={partner.name}
                  />
                )}
              </section>
            );
          })}

          <p>
            Check the{" "}
            <a href="https://unlock-protocol.com/guides/">
              Unlock Protocol guides
            </a>{" "}
            for more examnples of integrations or the{" "}
            <a href="https://docs.unlock-protocol.com/">docs</a> if you are
            interested in build your own!
          </p>
        </article>
      </ColumnLayout>
    </div>
  );
};

export default NextPage;
