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

  let actionButton = <Button onClick={join}>Become a member now!</Button>;

  if (!isAuthenticated) {
    actionButton = <Button onClick={() => login()}>Sign-in</Button>;
  }

  return (
    <div className="absolute inset-x-0 z-10 pt-6">
      <div className="flex flex-col mt-12 items-center">
        <span className="font-bold	">🔒 Members only!</span>
        <div className="">{actionButton}</div>
      </div>
    </div>
  );
};
