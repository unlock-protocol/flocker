import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button } from "../../../../components/Button";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { Navigation } from "../../../../components/Navigation";
import { createCheckoutURL } from "../../../../utils";

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

  return (
    <div>
      <Navigation />
      <ColumnLayout className="pt-12">
        <header className="box-border flex flex-col max-w-2xl gap-4 pb-6 mx-auto">
          <h1 className="text-3xl font-bold sm:text-5xl">What&apos; next?</h1>
          <div className="block text-lg text-gray-500 sm:text-xl ">
            Share this link with your followers for them to claim your
            membership!
          </div>
        </header>
        <div className="grid gap-6">
          {checkoutURL && (
            <Button
              onClick={async (event) => {
                event.preventDefault();
                try {
                  if (navigator.share) {
                    const shareCheckoutData = {
                      title: "Unlock checkout",
                      text: "Buy membership.",
                      url: checkoutURL.toString(),
                    };
                    await navigator.share(shareCheckoutData);
                  }
                } catch (error) {
                  console.error(error);
                  window.open(checkoutURL.toString());
                }
              }}
            >
              Share checkout
            </Button>
          )}
          <Button
            onClick={(event) => {
              event.preventDefault();
              window.open(checkoutURL!.toString());
            }}
          >
            Try checkout
          </Button>
        </div>
        <article className="prose">
          <h1>
            You now have your own membership list that can never be taken away
            from you. And, as a bonus, you and your fans and followers — your
            members — can go anywhere together.
          </h1>
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
      </ColumnLayout>
    </div>
  );
};

export default NextPage;
