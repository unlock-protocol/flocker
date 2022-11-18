import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";
import NextLink from "next/link";

export function Navigation() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between w-full max-w-2xl px-6 mx-auto h-14 md:px-0">
        <NextLink href="/">
          <h1 className="font-extrabold">Flocker</h1>
        </NextLink>
        <div>
          {isAuthenticated ? (
            <Button
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
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
