import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { Navigation } from "../components/Navigation";
import { ColumnLayout } from "../components/ColumnLayout";
import { ContractDeployBox } from "../components/ContractDeployBox";
import { ContractsView } from "../components/ContractsView";
import { NextSeo } from "next-seo";
import { routes } from "../config/routes";
import { SelectTwitterProfile } from "../components/SelectTwitterProfile";
export default function Home() {
  const { login, isAuthenticated, user, isAuthenticating } = useAuth();
  const router = useRouter();
  const [twitterUsername, setTwitterUsername] = useState<string>();

  useEffect(() => {
    setTwitterUsername(router.query?.twitterUsername?.toString());
  }, [router.query?.twitterUsername]);

  return (
    <div>
      <NextSeo
        title={routes.home.seo.title}
        description={routes.home.seo.description}
        openGraph={routes.home.seo.openGraph}
      />
      <Navigation />
      <ColumnLayout className="pt-12">
        <header className="box-border flex flex-col max-w-2xl gap-4 mx-auto">
          <h1 className="text-5xl font-extrabold">
            Connect with your fans and followers nearly anywhere.
          </h1>
          <h2 className="block text-lg text-gray-500 sm:text-xl">
            Create your own membership smart contract in five minutes.
          </h2>
        </header>
        {isAuthenticated && !twitterUsername && <ContractsView user={user} />}
        <div className="grid gap-6 mt-6">
          {!twitterUsername && (
            <SelectTwitterProfile
              twitterUsername={twitterUsername}
              setTwitterUsername={setTwitterUsername}
            />
          )}
          {twitterUsername && !isAuthenticated && (
            <div className="grid gap-6">
              <p>
                Let&apos;s get you set up to deploy your membership contract!
              </p>
              <Button
                loading={isAuthenticating}
                onClick={() => {
                  login({ twitterUsername });
                }}
              >
                Continue
              </Button>
            </div>
          )}
          {twitterUsername && isAuthenticated && (
            <ContractDeployBox twitterUsername={twitterUsername} />
          )}
        </div>
      </ColumnLayout>
    </div>
  );
}
