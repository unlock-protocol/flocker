import { minifyAddress } from "../utils";
import useClipboard from "react-use-clipboard";
import {
  FaCopy as CopyIcon,
  FaExternalLinkAlt as ExternaLinkIcon,
} from "react-icons/fa";
import networks from "@unlock-protocol/networks";
import { toast } from "react-hot-toast";

export interface Props {
  lockAddress: string;
  network: number;
}

export function LockAddress({ lockAddress, network }: Props) {
  const [isCopied, setIsCopied] = useClipboard(lockAddress, {
    successDuration: 1000,
  });
  const explorerURL = networks[network]?.explorer?.urls?.address(lockAddress);
  return (
    <div className="inline-flex flex-wrap items-center justify-between gap-2">
      <div className="font-bold">{minifyAddress(lockAddress)}</div>
      <div className="inline-flex items-center gap-2">
        <button
          aria-label="copy"
          className="inline-flex items-center gap-2 px-2 py-1 text-sm text-gray-500 bg-gray-100 rounded-lg hover:text-gray-900"
          onClick={() => {
            setIsCopied();
          }}
        >
          <CopyIcon />
          {isCopied ? "Copied" : "Copy"}
        </button>
        {explorerURL && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={explorerURL}
            className="inline-flex items-center gap-2 p-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg hover:text-gray-900"
          >
            <ExternaLinkIcon />
          </a>
        )}
      </div>
    </div>
  );
}
