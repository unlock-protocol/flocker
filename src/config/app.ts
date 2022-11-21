export const app = {
  locksmith:
    process.env.NEXT_PUBLIC_LOCKSMITH_URI! ||
    "https://locksmith.unlock-protocol.com/",
  recaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY!,
  unlockApp:
    process.env.NEXT_PUBLIC_UNLOCK_APP! || "https://app.unlock-protocol.com/",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL! || "https://flocker.app/",
  defaultNetwork: Number(process.env.NEXT_PUBLIC_DEFAULT_NETWORK) || 137,
  browserLessAPIKey: process.env.BROWSERLESS_API_KEY!,
  twitterToken: process.env.TWITTER_BEARER_TOKEN!,
};
