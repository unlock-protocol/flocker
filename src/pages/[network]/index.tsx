import { NextPage, GetServerSideProps } from "next";
import { ens } from "../../utils/getServerSideProps";
import { TokenData } from "../../utils";
import { IndexPage as Index } from "./locks/[lock]/index";

interface Props {
  network: number;
  lockAddress: string;
  tokenData: TokenData;
  lock: any;
}

const IndexPage: NextPage<Props> = Index;

export const getServerSideProps: GetServerSideProps = ens;

export default IndexPage;
