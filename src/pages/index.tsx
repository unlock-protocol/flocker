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
import {
  FaShare as ShareIcon,
  FaEdit as EditIcon,
  FaRocket as FinishIcon,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { SiTwitter as TwitterIcon } from "react-icons/si";

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
      <ColumnLayout>
        <header className="box-border flex flex-col max-w-2xl gap-4 mx-auto">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Connect with your fans and followers nearly anywhere.
          </h1>
          <h2 className="block text-lg text-gray-500 sm:text-xl">
            Create your own membership smart contract in 1 minute!
          </h2>
        </header>

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
          {isAuthenticated && !twitterUsername && <ContractsView user={user} />}
          {!isAuthenticated && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">
                  Get your flock off of Twitter
                </h2>
                <p className="text-gray-600">
                  Flocker helps you bring your Twitter followers with you to
                  Web3 with an Unlock-powered membership smart contract.
                </p>
              </div>
              <ul className="relative ml-2 border-l border-gray-200">
                {items.map((item, index) => (
                  <ListItem {...item} key={index} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </ColumnLayout>
    </div>
  );
}

const items = [
  {
    text: "Enter your Twitter handle",
    description: "This will be used as your contract name and icon.",
    Icon: TwitterIcon,
  },
  {
    text: "Create a free membership (smart contract)",
    description:
      "Smart contracts are programs on the blockchain. They set up memberships and provide membership access passes.",
    Icon: EditIcon,
  },
  {
    text:
      "Share the link to claim your membership card with your Twitter followers",
    description:
      "Your followers can claim your free membership with the link. The membership will be in the form of an NFT.",
    Icon: ShareIcon,
  },
  {
    text: "Connect with them on any service that supports token-gated access",
    description:
      "You can now create communities, content, applications, and more and token gate them so only your members can access them. For example, use Guild.xyz to token gate your exclusive Discord or Telegram.",
    Icon: FinishIcon,
  },
];

interface ListItemProps {
  text: string;
  description?: string;
  Icon: IconType;
}

export function ListItem({ text, description, Icon }: ListItemProps) {
  return (
    <li className="mb-6 ml-6">
      <span className="absolute inline-flex items-center justify-center p-1 bg-blue-200 rounded-full -left-3">
        <Icon className="fill-blue-500" />
      </span>
      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
        {text}
      </h3>
      {description && <p className="text-gray-600">{description}</p>}
    </li>
  );
}
