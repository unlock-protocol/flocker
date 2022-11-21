import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/useAuth";
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
  toFormData,
  TokenData,
} from "../../../../utils";
import { useCallback, useEffect } from "react";
import { Navigation } from "../../../../components/Navigation";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { FaHashtag as BackgroundColorIcon } from "react-icons/fa";
import { toast } from "react-hot-toast";

const NextPage: NextPage = () => {
  const { isAuthenticated, storage } = useAuth();
  const router = useRouter();
  const lock = router.query.lock?.toString();
  const network = Number(router.query.network);
  const username = router.query?.username?.toString();

  const { data: twitterProfile, isLoading: isTwitterLoading } = useQuery(
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

  const { data: metadata, isInitialLoading: isMetadataLoading } = useQuery(
    ["metadata", lock, network],
    async () => {
      const response = await storage.lockMetadata(network, lock!);
      const data = toFormData(response.data as TokenData);
      return data;
    },
    {
      enabled: isAuthenticated && !!lock && !!network,
      onError(error: Error) {
        console.error(error.message);
      },
      retry: false,
      refetchOnMount: true,
    }
  );

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

  const { handleSubmit, register, reset } = useForm<MetadataFormData>({
    defaultValues: {},
  });

  useEffect(() => {
    if (metadata && Object.keys(metadata).length !== 0) {
      reset(metadata);
    }
  }, [metadata, reset]);

  if (isMetadataLoading || isTwitterLoading) {
    return null;
  }

  return (
    <div>
      <Navigation />
      <ColumnLayout className="pt-12">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("website")}
            icon={<LinkIcon />}
            label="Website"
            placeholder="https://"
            optional
          />
          <Input
            disabled={isUpdatingMetadata}
            type="url"
            {...register("discord")}
            icon={<DiscordIcon />}
            label="Discord"
            placeholder="https://"
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
            type="url"
            {...register("mastodon")}
            icon={<MastodonIcon />}
            label="Mastodon"
            placeholder="https://"
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
