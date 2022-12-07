import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { Navigation } from "../../../../components/Navigation";
import { ogUrl } from "../../../../utils";
import { NextSeo } from "next-seo";
import { customizeSEO } from "../../../../config/seo";
import { app } from "../../../../config/app";
import { SiTwitter as TwitterIcon } from "react-icons/si";
import { FiEye as PreviewIcon } from "react-icons/fi";
import Link from "next/link";
import partners from "../../../../config/partners";

const NextPage: NextPage = () => {
  const router = useRouter();
  const lock = router.query.lock?.toString();
  const username = router.query.username?.toString();
  const network = Number(router.query.network);

  const checkoutURL = new URL(
    `/${network}/locks/${lock}/checkout`,
    app.baseURL
  ).toString();

  const shareUrl = useMemo<string>(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set(
      "text",
      "Claim a free membership from me and follow me anywhere on the web!"
    );
    if (checkoutURL) {
      url.searchParams.set("url", checkoutURL.trim());
    }
    if (checkoutURL) {
      url.searchParams.set("via", "unlockProtocol");
    }
    return url.toString();
  }, [checkoutURL]);

  return (
    <div>
      <NextSeo
        {...customizeSEO({
          title: "Share",
          description: "Share your profile to users.",
          imagePath: ogUrl(
            new URL(`/${network}/locks/${lock}/share`, app.baseURL)
          ),
          twitter: {
            handle: username,
          },
        })}
      />
      <Navigation />
      <ColumnLayout>
        <header className="box-border flex flex-col max-w-2xl gap-4 pb-6 mx-auto">
          <h1 className="text-3xl font-bold sm:text-5xl">What&apos;s next?</h1>
          <h2 className="block text-lg text-gray-500 sm:text-xl">
            Share this link with your followers for them to claim your
            membership!
          </h2>
        </header>
        <div
          className="grid border rounded-lg shadow-xl md:grid-cols-3 shadow-blue-50"
          role="group"
        >
          {checkoutURL && (
            <a
              className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium text-black bg-white rounded-t-lg cursor-pointer md:rounded-l-lg hover:bg-gray-50 disabled:cursor-not-allowed"
              target="_blank"
              href={shareUrl}
              rel="noopener noreferrer"
            >
              <TwitterIcon /> Share on Twitter
            </a>
          )}
          <Link
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium text-black bg-white cursor-pointer border-y md:border-y-0 md:border-x disabled:cursor-not-allowed hover:bg-gray-50"
            href={`/${network}/locks/${lock}`}
          >
            <PreviewIcon />
            Preview profile
          </Link>
          <a
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-medium text-black bg-white rounded-b-lg cursor-pointer md:rounded-r-lg disabled:cursor-not-allowed hover:bg-gray-50"
            target="_blank"
            href="https://app.unlock-protocol.com/locks"
            rel="noopener noreferrer"
          >
            Unlock Dashboard
          </a>
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
