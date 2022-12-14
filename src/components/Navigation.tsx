import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";
import NextLink from "next/link";
import Image from "next/image";

export function Navigation() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-30 bg-white bg-opacity-50 border-b border-gray-100 backdrop-blur backdrop-filter firefox:bg-opacity-90">
      <div className="flex items-center justify-between max-w-2xl px-6 mx-auto h-14 sm:px-0">
        <NextLink className="whitespace-nowrap flex" href="/">
          <Image
            className="mr-2"
            alt="Flocker Logo"
            src="/logo.svg"
            height={30}
            width={30}
          />
          <h1 className="font-extrabold">Flocker</h1>
        </NextLink>
        <div>
          {isAuthenticated ? (
            <Button
              secondary
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                login();
              }}
            >
              Sign-in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
