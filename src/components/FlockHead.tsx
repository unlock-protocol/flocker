import { NextSeo } from "next-seo";
import { ColumnLayout } from "../components/ColumnLayout";
import { Navigation } from "../components/Navigation";
import { Profile } from "../components/Profile";
import { HiUsers } from "react-icons/hi";

import { app } from "../config/app";
import { customizeSEO } from "../config/seo";
import {
  createCheckoutURL,
  isUserLockManager,
  ogUrl,
  TokenData,
  getTwitterHandle,
} from "../utils";
import Link from "next/link";

interface FlockHeadProps {
  tokenData: any;
  network: number;
  lock: any;
  links: any;
  children: any;
}

export const FlockHead = ({
  tokenData,
  network,
  lock,
  links,
  children,
}: FlockHeadProps) => {
  return (
    <div className="flex flex-col flex-1 h-screen">
      <NextSeo
        {...customizeSEO({
          description: tokenData.description,
          title: tokenData.name,
          imagePath: ogUrl(
            new URL(`/${network}/locks/${lock?.address}`, app.baseURL)
          ),
          twitter: {
            handle: getTwitterHandle(links.twitter),
            site: links.twitter,
          },
        })}
      />
      <Navigation />
      <ColumnLayout>
        <Profile
          network={network}
          lock={lock}
          name={tokenData.name}
          description={tokenData.description}
          imageURL={tokenData.image || "/logo.svg"}
          externalURL={tokenData.external_url}
        />
        {lock && lock.totalKeys > 0 && (
          <div className="flex flex-col m-5 items-center">
            <Link
              href={`/${network}/locks/${lock?.address}/members`}
              className="font-medium"
            >
              <HiUsers className="inline-block h-8 mx-2" />
              {lock.totalKeys == 1
                ? `${lock.totalKeys} member`
                : `${lock.totalKeys} members`}
            </Link>
          </div>
        )}

        {children}
      </ColumnLayout>
    </div>
  );
};

export default FlockHead;
