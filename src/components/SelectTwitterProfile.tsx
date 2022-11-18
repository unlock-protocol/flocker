import { SiTwitter as TwitterIcon } from "react-icons/si";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";
import { Input } from "./Input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import NextLink from "next/link";

interface SelectTwitterProfileProps {
  setTwitterProfile: any;
}

export function SelectTwitterProfile({
  setTwitterProfile,
}: SelectTwitterProfileProps) {
  const [username, setUsername] = useState("");

  const {
    isLoading,
    mutate: retrieveProfile,
    data: lockContract,
  } = useMutation({
    mutationKey: ["username", username],
    mutationFn: async () => {
      // Get the Twitter handle and details!
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
          label="Your twitter username"
          icon={<TwitterIcon size={20} />}
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
          disabled={isLoading}
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
