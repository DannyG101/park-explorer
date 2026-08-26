import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import authParkImage from "@/assets/parks/auth-park.jpg";
import { useTRPC } from "@/trpc";
import { Button } from "../components/ui/button";

export function AppLayout() {
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
      <main className="flex min-h-screen items-center justify-center bg-emerald-50/20">
        <p className="text-lg text-slate-700">Checking your session...</p>
      </main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-slate-50 to-slate-50">
      <header className="relative overflow-hidden">
        <img
          src={authParkImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-slate-950/55" />

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-emerald-50/40" />

        <div className="relative z-10 flex w-full items-center justify-between px-8 pb-10 pt-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Park Explorer
            </h1>

            <p className="mt-1 text-sm text-white/85">
              Discover parks across Israel
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white/90">
              Hi,{" "}
              <span className="font-semibold text-white">
                {meQuery.data.name}
              </span>
            </span>

            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white shadow-sm backdrop-blur-md hover:border-white/60 hover:bg-white/20 hover:text-white"
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