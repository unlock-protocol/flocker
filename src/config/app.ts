export const app = {
  locksmith: process.env.NEXT_PUBLIC_LOCKSMITH_URI!,
  recaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY!,
  unlockApp: process.env.NEXT_PUBLIC_UNLOCK_APP!,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  defaultNetwork: Number(process.env.NEXT_PUBLIC_DEFAULT_NETWORK) || 137,
  browserLessAPIKey: process.env.BROWSERLESS_API_KEY!,
  twitterToken: process.env.TWITTER_BEARER_TOKEN!,
};
