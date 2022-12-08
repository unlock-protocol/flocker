import { useState } from "react";
import { SiTwitter as TwitterIcon } from "react-icons/si";
import { buildButtonClasses, Button } from "./Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { app } from "../config/app";
interface ShareFlockerProps {
  address: string;
  network: number;
}

export const ShareFlocker = ({ address, network }: ShareFlockerProps) => {
  const [message, setMessage] = useState(
    `Claim a free membership from me and follow me anywhere on the web!`
  );

  const router = useRouter();

  const tweetThis = (event: any) => {
    event.preventDefault();

    const url = new URL(`https://twitter.com/intent/tweet`);
    url.searchParams.append(
      "url",
      `${app.baseURL}/${network}/locks/${address}`
    );
    url.searchParams.append("via", `unlockProtocol`);
    url.searchParams.append("text", message);
    router.push(url.toString());
  };

  return (
    <div className="m-5 p-5 bg-white rounded-md  flex flex-col shadow-xl shadow-blue-100">
      <label
        htmlFor="message"
        className="block mb-2 text-lg font-medium text-gray-900"
      >
        Invite new followers:
      </label>

      <textarea
        id="message"
        rows={3}
        onChange={(evt) => setMessage(evt.target.value)}
        className="block p-2.5 self-end w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Write your thoughts here..."
      >
        {message}
      </textarea>

      <Link
        href={`/${app.defaultNetwork}/locks/${address}/edit`}
        className={`w-40 self-end mt-3 ${buildButtonClasses()}`}
        onClick={tweetThis}
      >
        <TwitterIcon />
        Tweet this
      </Link>
    </div>
  );
};
