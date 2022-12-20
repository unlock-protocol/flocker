import { FiEdit as EditIcon } from "react-icons/fi";
import { buildButtonClasses, Button } from "./Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { app } from "../config/app";
interface EditFlockerProps {
  address: string;
  network: number;
}

export const EditFlocker = ({ address, network }: EditFlockerProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <Link
        href={`/${network}/locks/${address}/edit`}
        className={`${buildButtonClasses()} self-end`}
        onClick={(event) => {
          event.preventDefault();
          router.push(`/${network}/locks/${address}/edit`);
        }}
      >
        <EditIcon />
        Edit
      </Link>
    </div>
  );
};
