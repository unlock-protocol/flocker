import {
  SiSubstack as SubstackIcon,
  SiDiscord as DiscordIcon,
  SiInstagram as InstagramIcon,
  SiMastodon as MastodonIcon,
  SiTwitter as TwitterIcon,
} from "react-icons/si";
import { FiLink as LinkIcon } from "react-icons/fi";
import { LinkButton } from "./LinkButton";

export interface Props {
  website?: string;
  discord?: string;
  twitter?: string;
  mastodon?: string;
  instagram: string;
  other?: string;
  substack?: string;
}

export function ProfileLink({
  discord,
  twitter,
  website,
  mastodon,
  instagram,
  other,
  substack,
}: Props) {
  return (
    <div className="grid gap-6 py-6">
      {website && (
        <LinkButton
          icon={<LinkIcon />}
          href={website}
          label="My personal website"
        />
      )}
      {twitter && (
        <LinkButton
          icon={<TwitterIcon />}
          href={twitter}
          label="Follow me on twitter"
        />
      )}

      {substack && (
        <LinkButton
          icon={<SubstackIcon />}
          href={substack}
          label="Subscribe on substack"
        />
      )}
      {instagram && (
        <LinkButton
          icon={<InstagramIcon />}
          href={instagram}
          label="Follow me on instagram"
        />
      )}
      {mastodon && (
        <LinkButton
          icon={<MastodonIcon />}
          href={mastodon}
          label="Follow me on mastodon"
        />
      )}
      {discord && (
        <LinkButton
          icon={<DiscordIcon />}
          href={discord}
          label="Join my discord"
        />
      )}
      {other && <LinkButton icon={<LinkIcon />} href={other} label="Other" />}
    </div>
  );
}
