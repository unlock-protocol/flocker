import { useQuery } from "@tanstack/react-query";
import { SubgraphService } from "@unlock-protocol/unlock-js";
import { app } from "../config/app";
import networks from "@unlock-protocol/networks";
import { Button, LoadingIcon } from "./Button";
import { LockAddress } from "./LockAddress";
import { useRouter } from "next/router";

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

      return locks;
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
          <h3 className="text-lg font-extrabold sm:text-xl">
            Your membership contracts
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
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
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    router.push(
                      `/${app.defaultNetwork}/locks/${lock.address}/edit?username=${lock.name}`
                    );
                  }}
                >
                  Edit Attributes
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
