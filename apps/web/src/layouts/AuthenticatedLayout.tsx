import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { useTRPC } from "@/trpc";
import { Button } from "../components/ui/button";

export function AuthenticatedLayout() {
  const trpc = useTRPC();
  const navigate = useNavigate();

  const meQuery = useQuery(trpc.auth.me.queryOptions());

  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: () => {
        navigate("/login");
      },
    }),
  );

  if (meQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-700">Checking your session...</p>
      </main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="flex w-full items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Park Explorer
            </h1>

            <p className="text-sm text-slate-600">
              Discover parks across Israel
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700">
              Hi,{" "}
              <span className="font-semibold text-slate-950">
                {meQuery.data.name}
              </span>
            </span>

            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
