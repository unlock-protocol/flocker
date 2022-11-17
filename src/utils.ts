import { app } from "./config/app";

export const createLocalStorageValue = (key: string) => {
  const getKey = () => {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  };
  const setKey = (value: string) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [getKey, setKey] as const;
};

interface Options {
  lock: string;
  network: number;
}

export const createCheckoutURL = ({ network, lock }: Options) => {
  const checkoutConfig = {
    locks: {
      [lock]: {
        network,
        emailRequired: true,
      },
    },
    pessimistic: true,
  };
  const checkoutURL = new URL("/checkout", app.unlockApp);
  const redirectURL = new URL(`/${network}/locks/${lock}`, app.baseURL);
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
  const { attributes, name, description, background_color } = props;
  const allItems = attributes?.filter(
    (item) => typeof item.value === "string" && !item.max_value
  );

  const record = allItems?.reduce<Record<string, string>>((acc, item) => {
    acc[item.trait_type] = item.value?.toString();
    return acc;
  }, {});

  const items = allItems?.filter(
    (item) =>
      !["instagram", "website", "substack", "discord", "twitter"].includes(
        item.trait_type.toLowerCase()
      )
  );

  const discord = record?.discord;
  const substack = record?.substack;
  const website = record?.website;
  const instagram = record?.instagram;
  const twitter = record?.twitter;

  return {
    name,
    description,
    discord,
    substack,
    website,
    instagram,
    twitter,
    items,
    background_color,
  };
};

export interface MetadataFormData {
  twitter?: string;
  description: string;
  website?: string;
  instagram?: string;
  substack?: string;
  discord?: string;
  background_color?: string;
  items?: Attribute[];
}

export const formDataToTokenAttributes = (formData: MetadataFormData) => {
  const attributes: Attribute[] = [];
  const { items, ...rest } = formData;
  const known = Object.entries(rest)
    .filter(
      ([key, value]) =>
        key &&
        value &&
        ["instagram", "website", "substack", "discord", "twitter"].includes(key)
    )
    .map(
      ([key, value]) =>
        ({
          value,
          trait_type: key,
        } as Attribute)
    );

  if (known) {
    attributes.push(...known);
  }

  if (items) {
    attributes.push(...items);
  }
  console.log(rest, known, items);

  return attributes;
};
