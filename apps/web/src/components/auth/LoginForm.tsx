import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useTRPC } from "../../trpc";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.me.queryFilter());

        navigate("/parks");
      },
    }),
  );

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-950">
          Welcome back
        </CardTitle>

        <p className="text-sm text-slate-600">
          Enter your details to continue.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-slate-800">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-slate-800">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="h-11"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {loginMutation.isError && (
            <p className="text-sm font-medium text-red-600">
              {loginMutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            className="h-11 w-full font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-semibold text-slate-950 underline-offset-4 hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
