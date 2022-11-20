import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button } from "../../../../components/Button";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { Navigation } from "../../../../components/Navigation";
import { createCheckoutURL } from "../../../../utils";

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
    youtube: "XXX",
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
    youtube: "XXX",
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
            Your contract (it's called a <em>lock</em>) was deployed on the{" "}
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
                <iframe
                  width="560"
                  height="315"
                  src={partner.youtube}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </section>
            );
          })}
        </article>
      </ColumnLayout>
    </div>
  );
};

export default NextPage;
