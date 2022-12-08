import { FiLink as LinkIcon } from "react-icons/fi";

const partners = [
  {
    name: "Paragraph.xyz",
    attribute: "paragraph",
    icon: <LinkIcon></LinkIcon>,
    label: "Paragraph Publication",
    type: "url",
    placeholder: "https://paragraph.xyz/@...",
    url: "https://paragraph.xyz/",
    description: `
        Paragraph is a service for Web3-powered newsletters where you can write
        content, grow your audience and foster a community. No matter if your
        readers are on web2 or web3, Paragraph turns your subscribers into
        members.`,
    youtube: "https://www.youtube.com/embed/KaMVpOnZveE",
  },
  {
    name: "Highlight.xyz",
    attribute: "highlight",
    url: "https://highlight.xyz/",
    description: `
        Highlight is an end-to-end toolkit to bring web3 membership and rewards
        to your fanbase, with no crypto experience required. In minutes, anyone
        can build a custom-branded community home, with rich integrations that
        offer ongoing utility and exclusive access.`,
    youtube: "https://www.youtube.com/embed/LEfQ8zGWT4c",
  },
  {
    name: "Geneva",
    attribute: "geneva",
    url: "http://geneva.com",
    description: `Geneva is where your group chats, and gives you everything you need to
        keep your groups, clubs, and communities organized and connected.`,
    youtube: "https://www.youtube.com/embed/c1WKFrrf2QY",
  },
  {
    name: "Tropee",
    attribute: "tropee",
    url: "https://www.tropee.com/",
    description:
      "Tropee is a collection of utilities you can use to create events, content, raffles, and more for your members.",
    youtube: "https://www.youtube.com/embed/7Mg6sif6iYI",
  },
  {
    name: "Discord with Guild.xyz",
    attribute: "discord",
    url: "https://unlock-protocol.com/blog/guildxyz-launch",
    description: `Discord is the easiest way to talk over voice, video, and text. Talk,
        chat, hang out, and stay close with your friends and communities. Token gate your discord community with guild.xyz`,
    youtube: "https://www.youtube.com/embed/ClLaLlPm904",
  },
  {
    name: "Telegram",
    attribute: "telegram",
    url:
      "https://unlock-protocol.com/guides/how-to-token-gate-telegram-with-unlock-protocol-and-guild-xyz/",
    description:
      "Telegram is a globally-accessible messaging and chat service. Token gate your telegram community with guild.xyz",
    youtube: "https://www.youtube.com/embed/ClLaLlPm904",
  },
  {
    name: "WordPress",
    attribute: "wordpress",
    url: "https://wordpress.org/plugins/pmpro-unlock/",
    description: (
      <p>
        WordPress powers 43% of websites. You can create members-only areas for
        WordPress sites using the{" "}
        <a href="https://wordpress.org/plugins/unlock-protocol/">
          Unlock WordPress plugin
        </a>{" "}
        or{" "}
        <a href="https://wordpress.org/plugins/pmpro-unlock/">
          PaidMembershipsPro
        </a>
        .
      </p>
    ),
    image: "/illustrations/wordpress-plugin.png",
  },
];

export default partners;
