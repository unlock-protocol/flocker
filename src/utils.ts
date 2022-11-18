import { app } from "./config/app";

export const createLocalStorageValue = <T = string>(key: string) => {
  const getKey = (): T | undefined => {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  };
  const setKey = (value: T | undefined) => {
    if (!value) {
      return;
    }
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
        emailRequired: false,
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
  const { attributes, name, description, background_color, youtube_url } =
    props;
  const allItems = attributes?.filter(
    (item) => typeof item.value === "string" && !item.max_value
  );
  const record = allItems?.reduce<Record<string, string>>((acc, item) => {
    acc[item.trait_type] = item.value?.toString();
    return acc;
  }, {});

  const website = record?.website;
  const discord = record?.discord;
  const substack = record?.substack;
  const instagram = record?.instagram;

  return {
    name,
    description,
    discord,
    substack,
    website,
    instagram,
    youtube_url,
    background_color,
  };
};

export interface MetadataFormData {
  website?: string;
  instagram?: string;
  substack?: string;
  discord?: string;
  youtube_url?: string;
  background_color?: string;
}

export const formDataToTokenAttributes = (formData: MetadataFormData) => {
  const { background_color, ...rest } = formData;
  const attributes = Object.entries(rest)
    .filter(
      ([key, value]) =>
        key &&
        value &&
        ["website", "substack", "discord", "instagram"].includes(key)
    )
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
