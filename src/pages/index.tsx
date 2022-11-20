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
  const { login, isAuthenticated, user } = useAuth();
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
          <div className="text-3xl font-extrabold sm:text-5xl">
            <div>Break free from twitter.</div>
            <div>Connect with your audience without barriers. </div>
          </div>
          <div className="block text-lg text-gray-500 sm:text-xl ">
            <div>Deploy your own membership contract in 5 minutes.</div>
            <div> It doesn&apos;t take much. </div>
          </div>
        </header>
        <div className="w-full max-w-2xl mx-auto">
          {isAuthenticated && !twitterUsername && <ContractsView user={user} />}
          <div className="grid gap-6 mt-6">
            {!twitterUsername && (
              <SelectTwitterProfile
                twitterUsername={twitterUsername}
                setTwitterUsername={setTwitterUsername}
              />
            )}
            {twitterUsername && !isAuthenticated && (
              <>
                <p>
                  Let&apos;s get you authenticated to deploy your membership
                  contract!
                </p>
                <Button
                  onClick={() => {
                    login({ twitterUsername });
                  }}
                >
                  Authenticate
                </Button>
              </>
            )}
            {twitterUsername && isAuthenticated && (
              <ContractDeployBox twitterUsername={twitterUsername} />
            )}
          </div>
        </div>
      </ColumnLayout>
    </div>
  );
}
