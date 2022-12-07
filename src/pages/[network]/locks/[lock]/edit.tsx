import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/useAuth";
import { app } from "../../../../config/app";
import { HiOutlineClipboardCopy as CopyLineIcon } from "react-icons/hi";
import {
  SiSubstack as SubstackIcon,
  SiDiscord as DiscordIcon,
  SiInstagram as InstagramIcon,
  SiMastodon as MastodonIcon,
  SiYoutube as YoutubeIcon,
} from "react-icons/si";
import { FiLink as LinkIcon } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import {
  Attribute,
  formDataToTokenAttributes,
  MetadataFormData,
  TokenData,
} from "../../../../utils";
import partners from "../../../../config/partners";
import { useCallback, useEffect } from "react";
import { Navigation } from "../../../../components/Navigation";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { FaHashtag as BackgroundColorIcon } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useLockMetadata } from "../../../../hooks/useLockMetadata";
import { FormLink } from "../../../../components/FormLink";
import useClipboard from "react-use-clipboard";

interface ContractDetailsProps {
  lock: string;
}

const ContractDetails = ({ lock }: ContractDetailsProps) => {
  const [isCopied, setCopied] = useClipboard(lock);

  const copy = (name: string) => {
    setCopied();
    toast.success(`${name} copied to clipboard!`);
  };

  return (
    <li
      onClick={() => copy("Contract address")}
      className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer"
    >
      <span className="w-48 inline-block">Contract address (Polygon):</span>
      <CopyLineIcon className="inline mr-1" size={18} />
      <code className="">{lock}</code>
    </li>
  );
};

interface PurchaseUrlDetailsProps {
  lock: string;
  network: number;
}

const PurchaseUrlDetails = ({ network, lock }: PurchaseUrlDetailsProps) => {
  const [isCopied, setCopied] = useClipboard(
    `${app.baseURL}/${network}/locks/${lock}`
  );

  const copy = (name: string) => {
    setCopied();
    toast.success(`${name} copied to clipboard!`);
  };

  return (
    <li
      onClick={() => copy("Purchase URL")}
      className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer"
    >
      <span className="w-48 inline-block">Purchase URL:</span>
      <CopyLineIcon className="inline mr-1" size={18} />
      <code className="">
        {app.baseURL}/${network}/locks/{lock}
      </code>
    </li>
  );
};

const NextPage: NextPage = () => {
  const { isAuthenticated, storage } = useAuth();
  const router = useRouter();
  const lock = router.query.lock?.toString();
  const network = Number(router.query.network);
  const username = router.query?.username?.toString();

  const { data: twitterProfile, isInitialLoading: isTwitterLoading } = useQuery(
    ["twitter", username],
    async () => {
      const response = await fetch(`/api/twitter/${username}`, {
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        const twitter = await response.json();
        return twitter;
      }
      return {};
    },
    {
      enabled: isAuthenticated && !!lock && !!network,
      onError(error: Error) {
        console.error(error);
      },
      retry: false,
      refetchOnMount: true,
    }
  );

  const {
    data: metadata,
    isInitialLoading: isMetadataLoading,
  } = useLockMetadata({
    lockAddress: lock,
    network: network,
  });

  const { mutate: updateMetadata, isLoading: isUpdatingMetadata } = useMutation(
    {
      mutationKey: ["metadata", lock, network],
      mutationFn: async (metadata: Record<string, unknown>) => {
        const response = await storage.updateLockMetadata(network, lock!, {
          metadata,
        });
        return response.data;
      },
      onSuccess() {
        router.push(`/${network}/locks/${lock}/share?username=${username}`);
      },
      onError(error: Error) {
        toast.error(error.message);
      },
    }
  );

  const onSubmit = useCallback(
    async (formData: MetadataFormData) => {
      const attrs = formDataToTokenAttributes(formData);

      const attributes: Attribute[] = [
        ...attrs,
        {
          trait_type: "twitter",
          value: `https://twitter.com/${username}`,
        },
      ];
      const metadata: TokenData = {
        name: twitterProfile.username,
        attributes: attributes,
        description: twitterProfile.description,
        image: twitterProfile?.profile_image_url?.replace(
          "_normal",
          "_400x400"
        ),
      };

      if (formData.background_color) {
        metadata.background_color = formData.background_color?.replace("#", "");
      }

      if (formData.youtube_url) {
        metadata.youtube_url = formData.youtube_url;
      }

      updateMetadata(metadata);
    },
    [username, updateMetadata, twitterProfile]
  );

  const { handleSubmit, register, reset, setValue } = useForm<MetadataFormData>(
    {
      defaultValues: {},
    }
  );

  useEffect(() => {
    if (metadata && Object.keys(metadata).length !== 0) {
      reset(metadata);
    }
  }, [metadata, reset]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [router, isAuthenticated]);

  if (isMetadataLoading || isTwitterLoading) {
    return null;
  }

  return (
    <div>
      <Navigation />
      <ColumnLayout>
        <h2 className="text-2xl font-extrabold">Your Flocker!</h2>

        <p className="block text-lg text-gray-500 sm:text-xl mb-5">
          Set links where your flock (people who own one of your membership NFT)
          can access the content you publish for them in the web3 world.
        </p>

        <ul className="mb-8 text-sm">
          <ContractDetails lock={lock} />
          <PurchaseUrlDetails lock={lock} network={network} />
        </ul>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          {partners.map((partner: any, i: number) => {
            return (
              <FormLink key={i} {...register(partner.name)} partner={partner} />
            );
          })}

          <Input
            disabled={isUpdatingMetadata}
            {...register("discord")}
            icon={<DiscordIcon />}
            label="Discord"
            placeholder="Username#id"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("substack")}
            icon={<SubstackIcon />}
            label="Substack"
            placeholder="https://"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("instagram")}
            icon={<InstagramIcon />}
            label="Instagram"
            placeholder="https://"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("youtube_url")}
            icon={<YoutubeIcon />}
            label="Youtube"
            placeholder="https://"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            {...register("mastodon")}
            icon={<MastodonIcon />}
            label="Mastodon"
            placeholder="@user@server.tld"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("other")}
            icon={<LinkIcon />}
            label="Other"
            placeholder="https://"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            {...register("background_color")}
            icon={<BackgroundColorIcon />}
            optional
            maxLength={6}
            minLength={6}
            placeholder="000000"
            label="Background Color"
          />
          <Button loading={isUpdatingMetadata}>Continue</Button>
        </form>
      </ColumnLayout>
    </div>
  );
};

export default NextPage;
