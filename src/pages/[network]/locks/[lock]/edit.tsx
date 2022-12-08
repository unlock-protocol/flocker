import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/useAuth";
import { app } from "../../../../config/app";
import { HiOutlineClipboardCopy as CopyLineIcon } from "react-icons/hi";
import {
  SiSubstack as SubstackIcon,
  SiInstagram as InstagramIcon,
  SiMastodon as MastodonIcon,
  SiYoutube as YoutubeIcon,
  SiTwitter as TwitterIcon,
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
import { getLock } from "../../../../hooks/useLock";

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
      className="overflow-hidden sm:whitespace-nowrap text-ellipsis cursor-pointer"
    >
      <span className="w-48 inline-block">Contract address (Polygon):</span>
      <code className="whitespace-nowrap">
        <CopyLineIcon className="inline mr-1" size={18} />
        {lock}
      </code>
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
      className="overflow-hidden sm:whitespace-nowrap text-ellipsis cursor-pointer "
    >
      <span className="w-48 inline-block">Purchase URL:</span>
      <code className="whitespace-nowrap">
        <CopyLineIcon className="inline mr-1" size={18} />
        {app.baseURL}/{network}/locks/{lock}
      </code>
    </li>
  );
};

const EditPage: NextPage = () => {
  const { isAuthenticated, isAuthenticating, storage } = useAuth();
  const router = useRouter();
  const lockAddress = router.query.lock?.toString();
  const network = Number(router.query.network);
  const username = router.query?.username?.toString();

  useEffect(() => {
    // TODO OR NOT LOCK MANAGER!
    if (!isAuthenticated && !isAuthenticating) {
      router.push("/");
    }
  }, [router, isAuthenticated, isAuthenticating]);

  // Loading Twitter data when applicable (ie when setting up for the first time?)
  const { data: twitterProfile, isInitialLoading: isTwitterLoading } = useQuery(
    ["twitter", username, lockAddress],
    async () => {
      let twitterUsername = username;
      if (!twitterUsername && lockAddress) {
        // We don't have a username, which is... annoying!
        // But we can get it from the contract
        const lock = await getLock(app.defaultNetwork, lockAddress);
        if (lock?.name) {
          twitterUsername = lock.name;
        }
      }

      // Still no username. That's ok. Skip!
      if (!twitterUsername) {
        return {};
      }

      const response = await fetch(`/api/twitter/${twitterUsername}`, {
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
      enabled: isAuthenticated && !!lockAddress && !!network,
      onError(error: Error) {
        console.error(error);
      },
      retry: false,
      refetchOnMount: true,
    }
  );

  // Loading metadata
  const {
    data: metadata,
    isInitialLoading: isMetadataLoading,
  } = useLockMetadata({
    lockAddress,
    network,
  });

  // Saving metadata
  const { mutate: updateMetadata, isLoading: isUpdatingMetadata } = useMutation(
    {
      mutationKey: ["metadata", lockAddress, network],
      mutationFn: async (metadata: Record<string, unknown>) => {
        const response = await storage.updateLockMetadata(
          network,
          lockAddress!,
          {
            metadata,
          }
        );
        return response.data;
      },
      onSuccess() {
        router.push(`/${network}/locks/${lockAddress}/`);
      },
      onError(error: Error) {
        toast.error(error.message);
      },
    }
  );

  // Form
  const { handleSubmit, register, reset, setValue } = useForm<MetadataFormData>(
    {
      defaultValues: {},
    }
  );

  // Set values in form once they loaded
  useEffect(() => {
    if (metadata && Object.keys(metadata).length !== 0) {
      if (twitterProfile) {
        if (!metadata.twitter) {
          metadata.twitter = `https://twitter.com/${twitterProfile.username}`;
        }
      }

      reset(metadata);
    }
  }, [metadata, reset, twitterProfile]);

  // Form submitted!
  const onSubmit = useCallback(
    async (formData: MetadataFormData) => {
      const attrs = formDataToTokenAttributes(formData);
      const attributes: Attribute[] = [...attrs];

      const newMetadata: TokenData = {
        name: metadata?.name || "",
        description: metadata?.description,
        image: metadata?.image,
        attributes: attributes, // We save the attributes from above
      };

      if (twitterProfile.username) {
        newMetadata.name = twitterProfile.username;
      }
      if (twitterProfile.description) {
        newMetadata.description = twitterProfile.description;
      }
      if (twitterProfile.profile_image_url) {
        newMetadata.image = twitterProfile?.profile_image_url?.replace(
          "_normal",
          "_400x400"
        );
      }

      if (formData.background_color) {
        newMetadata.background_color = formData.background_color?.replace(
          "#",
          ""
        );
      }

      if (formData.youtube_url) {
        newMetadata.youtube_url = formData.youtube_url;
      }
      updateMetadata(newMetadata);
    },
    [metadata, updateMetadata, twitterProfile]
  );

  if (isMetadataLoading || isTwitterLoading || !lockAddress) {
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

        <ul className="mb-8 text-sm flex flex-col space-y-3 sm:space-y-0">
          <ContractDetails lock={lockAddress} />
          <PurchaseUrlDetails lock={lockAddress} network={network} />
        </ul>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          {partners.map((partner: any, i: number) => {
            return <FormLink key={i} register={register} partner={partner} />;
          })}

          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("twitter")}
            icon={<TwitterIcon />}
            label="Twitter"
            placeholder="https://twitter.com/..."
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

export default EditPage;
