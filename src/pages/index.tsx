import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { Navigation } from "../components/Navigation";
import { ColumnLayout } from "../components/ColumnLayout";
import { ContractDeployBox } from "../components/ContractDeployBox";
import { ContractsView } from "../components/ContractsView";

export default function Home() {
  const { login, isAuthenticated, user } = useAuth();
  return (
    <div>
      <Navigation />
      <ColumnLayout className="pt-12">
        <header className="box-border flex flex-col max-w-2xl gap-4 mx-auto">
          <div className="text-3xl font-extrabold sm:text-5xl">
            <div>Break free from twitter.</div>
            <div>Connect with your audience without barriers. </div>
          </div>
          <div className="block text-lg text-gray-500 sm:text-xl ">
            <div>Deploy your own membership contract in 5 minutes.</div>
            <div> It doesn&apos;t take much. </div>
          </div>
        </header>
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid gap-6 mt-6">
            {isAuthenticated && <ContractDeployBox />}
            {!isAuthenticated && (
              <Button
                onClick={() => {
                  login();
                }}
              >
                Get started
              </Button>
            )}
          </div>
          {isAuthenticated && <ContractsView user={user} />}
        </div>
      </ColumnLayout>
    </div>
  );
}
