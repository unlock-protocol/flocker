import {
  SiSubstack as SubstackIcon,
  SiDiscord as DiscordIcon,
  SiInstagram as InstagramIcon,
  SiMastodon as MastodonIcon,
  SiTwitter as TwitterIcon,
} from "react-icons/si";
import { FiLink as LinkIcon } from "react-icons/fi";
import { LinkButton } from "./LinkButton";
import partners from "../config/partners";

export interface Links {
  [key: string]: string;
}

export interface Props {
  links: Links;
}

export function ProfileLinks({ links }: Props) {
  return (
    <div className="grid gap-6 py-6">
      {partners.map((partner, i) => {
        if (links[partner.attribute]) {
          return (
            <LinkButton
              key={i}
              icon={partner.icon || <LinkIcon />}
              href={links[partner.attribute]}
              label={partner.name}
            />
          );
        }
      })}

      {links.website && (
        <LinkButton
          icon={<LinkIcon />}
          href={links.website}
          label="My personal website"
        />
      )}
      {links.twitter && (
        <LinkButton
          icon={<TwitterIcon />}
          href={links.twitter}
          label="Follow me on twitter"
        />
      )}

      {links.substack && (
        <LinkButton
          icon={<SubstackIcon />}
          href={links.substack}
          label="Subscribe on substack"
        />
      )}
      {links.instagram && (
        <LinkButton
          icon={<InstagramIcon />}
          href={links.instagram}
          label="Follow me on instagram"
        />
      )}
      {links.mastodon && (
        <LinkButton
          icon={<MastodonIcon />}
          href={links.mastodon}
          label="Follow me on mastodon"
        />
      )}
      {links.discord && (
        <LinkButton
          icon={<DiscordIcon />}
          href={links.discord}
          label="Join my discord"
        />
      )}
      {links.other && (
        <LinkButton icon={<LinkIcon />} href={links.other} label="Other" />
      )}
    </div>
  );
}
