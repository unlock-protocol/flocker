import { DEFAULT_SEO } from "./seo";
import type { DefaultSeoProps } from "next-seo";

export interface Route {
  label: string;
  seo: DefaultSeoProps;
}

export interface Routes {
  [key: string]: Route;
}

export const routes: Routes = {
  home: {
    label: "Home",
    seo: DEFAULT_SEO,
  },
};
