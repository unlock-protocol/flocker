import { createCheckoutURL } from "../utils";
import { Profile } from "./Profile";
import { ProfileLink } from "./ProfileLink";

export function DummyProfile() {
  return (
    <div className="space-y-2">
      <h4 className="text-gray-600">
        Create membership contract using flocker and share a profile by which
        everyone can claim your membership.
      </h4>
      <div className="w-full overflow-auto bg-white border rounded-xl">
        <div className="flex items-center w-full border-b bg-gray-50">
          <div className="flex gap-2 p-2">
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div>
          <nav className="sticky top-0 z-30 bg-opacity-75 border-b border-gray-100 backdrop-blur backdrop-filter firefox:bg-opacity-90">
            <div className="flex justify-end w-full max-w-2xl p-2 mx-auto">
              <button
                className="inline-flex items-center px-4 py-2 font-bold text-white bg-gray-900 rounded-full hover:bg-gray-800"
                onClick={(event) => {
                  event.preventDefault();
                  const checkoutURL = createCheckoutURL({
                    network: 100,
                    lock: "0xCE62D71c768aeD7EA034c72a1bc4CF58830D9894",
                  });
                  window.open(checkoutURL);
                }}
              >
                Claim membership
              </button>
            </div>
          </nav>
          <div className="p-6">
            <Profile
              name="Unlock Protocol"
              description="Ʉnlock is an open source protocol for membership and subscription NFTs!. Flocker is powered by Unlock NFT memberships."
              imageURL="/unlock.jpg"
            />
            <ProfileLink
              twitter="https://twitter.com/UnlockProtocol"
              discord="https://discord.com/invite/Ah6ZEJyTDp"
              website="https://unlock-protocol.com/"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
