import { SubgraphService } from "@unlock-protocol/unlock-js";
import { useQuery } from "@tanstack/react-query";
import networks from "@unlock-protocol/networks";
import { gql, useQuery as useGraphQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { time } from "console";

const byPage = 100;

const GET_MEMBERS_DATA = gql`
  query Members($addresses: [String]) {
    accounts(where: { id_in: $addresses }) {
      id
      domains {
        name
        resolvedAddress {
          id
        }
        resolver {
          address
          texts
        }
      }
    }
  }
`;

interface Member {}

export const getMembershipsByPage = async (
  network: number,
  address: string,
  count: number,
  page: number
) => {
  const subgraph = new SubgraphService(networks);
  if (!address || !network) {
    return null;
  }
  return subgraph.keys(
    {
      where: {
        lock: address,
      },
      skip: (page - 1) * count,
      first: count,
      // @ts-expect-error
      orderBy: "createdAtBlock",
      // @ts-expect-error
      orderDirection: "desc",
    },
    {
      networks: [network],
    }
  );
};

export function useMembers(
  network: number,
  lockAddress: string,
  count?: number,
  page?: number
) {
  const [members, setMembers] = useState<Member[]>([]);
  const { isLoading: membershipsLoading, data: memberships } = useQuery(
    ["members", network, lockAddress, count, page],
    async () => {
      const memberships = await getMembershipsByPage(
        network,
        lockAddress,
        count || byPage,
        page || 1
      );
      return memberships;
    }
  );

  // const { loading: memberLoading, data: members } = useGraphQuery(
  const { loading: memberLoading, data: ensData } = useGraphQuery(
    GET_MEMBERS_DATA,
    {
      variables: {
        addresses: memberships?.map((membership) => membership.owner),
      },
    }
  );

  useEffect(() => {
    // When the ENS data changes, we need to combine the members info!
    // First turn the ensData into a mapping
    if (Array.isArray(ensData?.accounts) && Array.isArray(memberships)) {
      const ensDataMapping = ensData.accounts.reduce(
        (accu: any, account: any) => {
          account.domains.forEach((domain: any) => {
            if (domain.resolvedAddress?.id === account.id) {
              accu[account.id] = {
                name: domain.name,
                // Add texts
              };
            }
          });

          return accu;
        },
        {}
      );

      const _members: Member[] = [];
      memberships.forEach((membership) => {
        _members.push({
          address: membership.owner,
          ...ensDataMapping[membership.owner],
        });
      });
      setMembers(_members);
    }
  }, [ensData, memberships]);

  return {
    isLoading: membershipsLoading || memberLoading,
    members,
  };
}
