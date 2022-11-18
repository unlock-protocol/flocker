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
      const locks = await subgraph.locks(
        {
          first: 10,
          where: {
            lockManagers_contains: [user.toLowerCase()],
          },
        },
        {
          networks: [app.defaultNetwork?.toString()],
        }
      );

      return locks;
    }
  );

  return (
    <div>
      {isLocksLoading && <LoadingIcon />}
      {!isLocksLoading && (
        <div className="pt-6">
          <h4 className="mb-4 font-bold"> Previous contracts </h4>
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
