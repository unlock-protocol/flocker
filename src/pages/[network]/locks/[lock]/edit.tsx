import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/useAuth";
import {
  SiSubstack as SubstackIcon,
  SiDiscord as DiscordIcon,
  SiInstagram as InstagramIcon,
  SiTwitter as TwitterIcon,
} from "react-icons/si";
import { FiLink as LinkIcon } from "react-icons/fi";
import { IoColorFill as BackgroundColorIcon } from "react-icons/io5";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import {
  formDataToTokenAttributes,
  MetadataFormData,
  toFormData,
  TokenData,
} from "../../../../utils";
import { useEffect } from "react";
import { Navigation } from "../../../../components/Navigation";
import { TextBox } from "../../../../components/TextBox";
import { ColumnLayout } from "../../../../components/ColumnLayout";

const NextPage: NextPage = () => {
  const { isAuthenticated, storage } = useAuth();
  const router = useRouter();
  const lock = router.query.lock?.toString();
  const network = Number(router.query.network);
  const username = router.query.username?.toString();

  const { data: metadata, isLoading: isMetadataLoading } = useQuery(
    ["metadata", lock, network],
    async () => {
      const response = await storage.lockMetadata(network, lock!);
      const data = toFormData(response.data as TokenData);
      return data;
    },
    {
      enabled: isAuthenticated && !!lock && !!network,
      retry: false,
      onError(error: Error) {
        console.error(error);
      },
    }
  );

  const { data: twitterProfile, isLoading: isTwitterProfileLoading } = useQuery(
    ["twitter", username],
    async () => {
      const response = await fetch(`/api/twitter/${username}`, {
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch twitter user");
      }
      const json = await response.json();
      return json;
    },
    {
      enabled: !!username,
      onError(error: Error) {
        console.error(error);
      },
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
    }
  );

  const { control, handleSubmit, register, reset } = useForm<MetadataFormData>({
    defaultValues: {},
  });

  useEffect(() => {
    if (metadata && Object.keys(metadata).length !== 0) {
      reset({
        ...metadata,
        twitter:
          metadata.twitter || twitterProfile?.username
            ? `https://twitter.com/${twitterProfile.username}`
            : undefined,
        description: metadata.description || twitterProfile?.description,
      });
    }
  }, [metadata, reset, twitterProfile]);

  const twitterProfileURL = twitterProfile?.profile_image_url?.replace(
    "_normal",
    "_bigger"
  );

  const onSubmit = async (formData: MetadataFormData) => {
    const attributes = formDataToTokenAttributes(formData);
    updateMetadata({
      attributes,
      name: formData.twitter,
      description: formData.description,
      image: twitterProfileURL,
      background_color: formData.background_color,
    });
  };

  // const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <div>
      <Navigation />
      <ColumnLayout className="mt-12">
        {twitterProfileURL && (
          <div className="mb-2">
            <img
              className="rounded-full"
              src={twitterProfileURL}
              alt={twitterProfile?.username || "avatar"}
            />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <Input
            type="url"
            {...register("twitter")}
            icon={<TwitterIcon />}
            label="Twitter"
            placeholder="https://"
          />
          <TextBox
            {...register("description")}
            label="Description"
            optional
            cols={4}
          />
          <Input
            type="url"
            {...register("website")}
            icon={<LinkIcon />}
            label="Website"
            placeholder="https://"
            optional
          />
          <Input
            type="url"
            {...register("discord")}
            icon={<DiscordIcon />}
            label="Discord"
            placeholder="https://"
            optional
          />
          <Input
            type="url"
            {...register("substack")}
            icon={<SubstackIcon />}
            label="Substack"
            placeholder="https://"
            optional
          />
          <Input
            type="url"
            {...register("instagram")}
            icon={<InstagramIcon />}
            label="Instagram"
            placeholder="https://"
            optional
          />
          <Input
            {...register("background_color")}
            icon={<BackgroundColorIcon />}
            optional
            placeholder="#000000"
            label="Background Color"
          />
          <Button loading={isUpdatingMetadata}>Continue</Button>
        </form>
      </ColumnLayout>
    </div>
  );
};

export default NextPage;
