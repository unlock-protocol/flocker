import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FiAtSign } from "react-icons/fi";
interface SelectTwitterProfileProps {
  twitterUsername?: string;
  setTwitterUsername: any;
}

export function SelectTwitterProfile({
  twitterUsername,
  setTwitterUsername,
}: SelectTwitterProfileProps) {
  const [username, setUsername] = useState(twitterUsername);

  const {
    isLoading,
    mutate: retrieveProfile,
    data: lockContract,
  } = useMutation({
    mutationKey: ["username", username],
    mutationFn: async () => {
      // Get the Twitter handle and details!
      const response = await fetch(`/api/twitter/${username}`, {
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.username) {
          setTwitterUsername(json.username);
        } else {
          toast.error(
            "This does not seem to be a valid Twitter profile. Please try again."
          );
        }
      } else {
        toast.error(
          "We could not find this Twitter profile! Please try again."
        );
      }
    },
    onError(error: Error) {
      console.error(error);
      toast.error(error?.message);
    },
  });

  return (
    <>
      <div className="grid gap-6">
        <Input
          label="Enter your Twitter username:"
          icon={<FiAtSign size={20} />}
          value={username}
          disabled={isLoading}
          onChange={(event) => {
            event.preventDefault();
            const value = event.target.value;
            setUsername(value);
          }}
        />
        <Button
          loading={isLoading}
          onClick={() => {
            retrieveProfile();
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
}
