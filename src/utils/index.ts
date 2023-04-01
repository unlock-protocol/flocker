import { app } from "../config/app";
import partners from "../config/partners";

interface Options {
  lockAddress: string;
  network: number;
  icon?: string;
  title?: string;
}

export const createCheckoutURL = ({
  network,
  lockAddress,
  icon,
  title,
}: Options) => {
  const checkoutConfig = {
    title,
    icon,
    locks: {
      [lockAddress]: {
        network,
        skipRecipient: true,
      },
    },
    pessimistic: true,
  };

  const checkoutURL = new URL("/checkout", app.unlockApp);
  const redirectURL = new URL(`/${network}/locks/${lockAddress}`, app.baseURL);
  checkoutURL.searchParams.append(
    "paywallConfig",
    JSON.stringify(checkoutConfig)
  );
  checkoutURL.searchParams.append("redirectUri", redirectURL.toString());
  return checkoutURL.toString();
};

export interface Attribute {
  display_type?: string;
  max_value?: number;
  trait_type: string;
  value: string | number;
}

export interface TokenData {
  name: string;
  image?: string;
  description?: string;
  external_url?: string;
  youtube_url?: string;
  animation_url?: string;
  background_color?: string;
  attributes?: Attribute[];
  [key: string]: any;
}

export const toFormData = (props: TokenData) => {
  const { attributes, ...rest } = props;
  const allItems = attributes?.filter(
    (item) => typeof item.value === "string" && !item.max_value
  );
  const record = allItems?.reduce<Record<string, string>>((acc, item) => {
    acc[item.trait_type] = item.value?.toString();
    return acc;
  }, {});

  const twitter = record?.twitter;
  const website = record?.website;
  const substack = record?.substack;
  const instagram = record?.instagram;
  const mastodon = record?.mastodon;
  const other = record?.other;
  const formData = {
    twitter,
    substack,
    website,
    instagram,
    mastodon,
    other,
    ...rest,
  };
  partners.forEach((partner) => {
    if (record) {
      // @ts-expect-error
      formData[partner.attribute] = record[partner.attribute];
    }
  });

  return formData;
};

export interface MetadataFormData {
  [key: string]: string;
}

export const formDataToTokenAttributes = (formData: MetadataFormData) => {
  const { background_color, ...rest } = formData;
  const acceptedAttributes = [
    "twitter",
    "website",
    "substack",
    "instagram",
    "mastodon",
    "twitter",
    "other",
  ];

  partners.forEach((partner) => {
    acceptedAttributes.push(partner.attribute);
  });

  const attributes = Object.entries(rest)
    .filter(([key, value]) => key && value && acceptedAttributes.includes(key))
    .map(
      ([key, value]) =>
        ({
          value,
          trait_type: key,
        } as Attribute)
    );
  return attributes;
};

export const minifyAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 6)}`;
};

export const ogUrl = (url: string | URL) => {
  const og = new URL("/api/og", app.baseURL);
  og.searchParams.append("url", url?.toString());
  return og.toString();
};

export const isUserLockManager = (lock: any, user: string) => {
  if (!lock?.lockManagers) {
    return false;
  }
  return (
    lock?.lockManagers
      .map((manager: string) => manager.toLowerCase())
      .indexOf(user?.toLowerCase()) >= 0
  );
};

export const getTwitterHandle = (link?: string) => {
  try {
    if (!link) {
      return;
    }
    const pattern = new URLPattern("https://twitter.com/:username");
    const matched = pattern.exec(link);
    return matched?.pathname.groups.username;
  } catch {}
};

export const linksFromTokenData: any = (tokenData: TokenData) => {
  return (tokenData.attributes || [])
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
};
