import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { createCheckoutURL } from "../utils";
import { Button } from "./Button";

interface BecomeMemberProps {
  address: string;
  network: number;
}

export const BecomeMember = ({ address, network }: BecomeMemberProps) => {
  const { isAuthenticated, login } = useAuth();

  const router = useRouter();

  const join = () => {
    router.push(
      createCheckoutURL({
        network,
        lockAddress: address,
      })
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col mt-12">
        <Button onClick={() => login()}>Sign-in</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-12">
      <Button onClick={join}>Become a member now!</Button>
    </div>
  );
};
