import { LocksmithService } from "@unlock-protocol/unlock-js";
import { NextPage, GetServerSideProps } from "next";
import { ColumnLayout } from "../../../../components/ColumnLayout";
import { LinkButton } from "../../../../components/LinkButton";
import { Navigation } from "../../../../components/Navigation";
import { app } from "../../../../config/app";
import { MetadataFormData, toFormData, TokenData } from "../../../../utils";
import {
  SiSubstack as SubstackIcon,
  SiDiscord as DiscordIcon,
  SiInstagram as InstagramIcon,
  SiTwitter as TwitterIcon,
} from "react-icons/si";

interface Props {
  network: number;
  lock: string;
  metadata: MetadataFormData;
}

const IndexPage: NextPage<Props> = ({ network, lock, metadata }) => {
  return (
    <div>
      <Navigation />
      <ColumnLayout className="mt-12">
        <div className="grid gap-6">
          {metadata.website && (
            <LinkButton
              label="Website"
              icon={<InstagramIcon />}
              href={metadata.website}
            />
          )}
          {metadata.twitter && (
            <LinkButton
              label="Twitter"
              icon={<TwitterIcon />}
              href={metadata.twitter}
            />
          )}
          {metadata.instagram && (
            <LinkButton
              label="Instagram"
              icon={<InstagramIcon />}
              href={metadata.instagram}
            />
          )}
          {metadata.discord && (
            <LinkButton
              label="Discord"
              icon={<DiscordIcon />}
              href={metadata.discord}
            />
          )}
        </div>
      </ColumnLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const lock = ctx.query.lock?.toString();
    const network = Number(ctx.query.network);
    const service = new LocksmithService(undefined, app.locksmith);
    const response = await service.lockMetadata(network, lock!);
    const data = response.data;
    const metadata = toFormData(data as TokenData);
    return {
      props: {
        // Serialize undefined into null
        metadata: Object.entries(metadata).reduce((acc, [key, value]) => {
          acc[key] = value || null;
          return acc;
        }, {} as any),
        lock,
        network,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default IndexPage;
