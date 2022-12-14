import {
  SiSubstack as SubstackIcon,
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
  hide: boolean;
}

export function ProfileLinks({ hide, links }: Props) {
  const classes = ["grid", "gap-6", "py-6"];
  if (hide) {
    classes.push("blur-sm");
  }
  return (
    <div className={classes.join(" ")}>
      {partners.map((partner, i) => {
        if (links[partner.attribute]) {
          return (
            <LinkButton
              hide={hide}
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
          hide={hide}
          icon={<LinkIcon />}
          href={links.website}
          label="My personal website"
        />
      )}
      {links.twitter && (
        <LinkButton
          icon={<TwitterIcon />}
          hide={hide}
          href={links.twitter}
          label="Follow me on twitter"
        />
      )}

      {links.substack && (
        <LinkButton
          hide={hide}
          icon={<SubstackIcon />}
          href={links.substack}
          label="Subscribe on substack"
        />
      )}
      {links.instagram && (
        <LinkButton
          hide={hide}
          icon={<InstagramIcon />}
          href={links.instagram}
          label="Follow me on instagram"
        />
      )}
      {links.mastodon && (
        <LinkButton
          hide={hide}
          icon={<MastodonIcon />}
          href={links.mastodon}
          label="Follow me on mastodon"
        />
      )}
      {links.other && (
        <LinkButton
          hide={hide}
          icon={<LinkIcon />}
          href={links.other}
          label="Other"
        />
      )}
    </div>
  );
}
