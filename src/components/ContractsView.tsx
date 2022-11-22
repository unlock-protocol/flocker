import { useQuery } from "@tanstack/react-query";
import { SubgraphService } from "@unlock-protocol/unlock-js";
import { app } from "../config/app";
import networks from "@unlock-protocol/networks";
import { LoadingIcon } from "./Button";
import { LockAddress } from "./LockAddress";
import { useRouter } from "next/router";
import {
  FiEye as PreviewIcon,
  FiEdit as EditIcon,
  FiShare2 as ShareIcon,
} from "react-icons/fi";
import Link from "next/link";

interface Props {
  user: string;
}

export function ContractsView({ user }: Props) {
  const router = useRouter();
  const { data: locks, isLoading: isLocksLoading } = useQuery(
    ["locks", user],
    async () => {
      const subgraph = new SubgraphService(networks);
      const locks = (
        await subgraph.locks(
          {
            first: 10,
            // @ts-expect-error - we don't export enums yet from unlock-js
            orderBy: "createdAtBlock",
            // @ts-expect-error - we don't export enums yet from unlock-js
            orderDirection: "desc",
            where: {
              lockManagers_contains: [user.toLowerCase()],
            },
          },
          {
            networks: [app.defaultNetwork?.toString()],
          }
        )
      ).filter((lock) => {
        return lock.name?.startsWith("@");
      });

      const items = await Promise.all(
        locks.map(async (lock) => {
          try {
            const response = await fetch(
              `${app.locksmith}/v2/api/metadata/${app.defaultNetwork}/locks/${lock.address}`
            );
            if (!response.ok) {
              throw new Error("Not found.");
            }
            return {
              ...lock,
              metadata: true,
            };
          } catch {
            return {
              ...lock,
              metadata: false,
            };
          }
        })
      );

      return items;
    },
    {
      refetchOnMount: true,
    }
  );

  return (
    <div>
      {isLocksLoading && <LoadingIcon />}
      {!isLocksLoading && locks && locks?.length > 0 && (
        <div className="pt-6">
          <h3 className="text-lg font-bold sm:text-xl">
            Your membership contracts
          </h3>
          <div className="grid gap-6 pt-2 sm:grid-cols-2">
            {locks?.map((lock) => (
              <div
                className="grid gap-6 p-4 bg-white rounded-lg shadow-sm"
                key={lock.address}
              >
                <div>
                  <h4 className="text-lg font-bold">{lock.name}</h4>
                  <LockAddress
                    lockAddress={lock.address}
                    network={app.defaultNetwork}
                  />
                </div>
                <div>
                  <div role="group" className="inline-flex items-center gap-2">
                    {lock.metadata && (
                      <Link
                        href={`/${app.defaultNetwork}/locks/${lock.address}/share?username=${lock.name}`}
                        className="inline-flex items-center gap-2 px-2 py-1 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
                      >
                        <ShareIcon />
                        Share
                      </Link>
                    )}
                    {lock.metadata && (
                      <Link
                        href={`/${app.defaultNetwork}/locks/${lock.address}`}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                      >
                        <PreviewIcon />
                        Preview
                      </Link>
                    )}
                    <Link
                      href={`/${app.defaultNetwork}/locks/${lock.address}/edit?username=${lock.name}`}
                      className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                      onClick={(event) => {
                        event.preventDefault();
                        router.push(
                          `/${app.defaultNetwork}/locks/${lock.address}/edit?username=${lock.name}`
                        );
                      }}
                    >
                      <EditIcon />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
