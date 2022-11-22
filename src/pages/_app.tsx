import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiConfig } from "wagmi";
import { Inter } from "@next/font/google";
import { wagmiClient } from "../config/wagmi";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import { DEFAULT_SEO } from "../config/seo";
import { hotjar } from 'react-hotjar';
import { useEffect } from "react";
import { useRouter } from "next/router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});



export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!hotjar.initialized()) {
      hotjar.initialize(3259412, 6);
    }
  }, [])

  useEffect(() => {
    if (hotjar.initialized()) {
      hotjar.stateChange(router.asPath)
    }
  }, [router.asPath]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <DefaultSeo {...DEFAULT_SEO} />
        <main className={`${inter.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
        <Toaster />
      </WagmiConfig>
    </QueryClientProvider>
  );
}
