import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { useMembers } from "../hooks/useMembers";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Link from "next/link";
import { Button } from "./Button";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
  cache: new InMemoryCache(),
});

export interface MemberProps {
  member: any;
}

export const Member = ({ member }: MemberProps) => {
  return (
    <li className="flex items-center	">
      <span className="m-2">
        <Jazzicon diameter={30} seed={jsNumberForAddress(member.address)} />
      </span>
      <span>{member.name || member.address}</span>
    </li>
  );
};

export interface Props {
  network: number;
  lock: any;
  page: number;
}

const BY_PAGE = 50;

export const MembersList = ({ lock, network, page }: Props) => {
  const { members, isLoading } = useMembers(
    network,
    lock.address,
    BY_PAGE,
    page
  );
  if (isLoading) {
    return null;
  }

  return (
    <>
      <ul className="flex flex-col">
        {members.map((member: any, id: number) => {
          return <Member key={id} member={member} />;
        })}
      </ul>
      <nav className="flex place-content-between py-8">
        {page > 1 && (
          <Button
            className=""
            href={`/${network}/locks/${lock?.address}/members?page=${page - 1}`}
          >
            ← Previous Page
          </Button>
        )}
        {page <= 1 && <span>&nbsp;</span>}
        {members.length == BY_PAGE && (
          <Button
            href={`/${network}/locks/${lock?.address}/members?page=${page + 1}`}
          >
            Next Page →
          </Button>
        )}
      </nav>
    </>
  );
};

export const Members = ({ lock, network, page }: Props) => {
  return (
    <ApolloProvider client={client}>
      <MembersList lock={lock} network={network} page={page}></MembersList>
    </ApolloProvider>
  );
};
