import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useTRPC } from "../../trpc";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const trpc = useTRPC();
  const navigate = useNavigate();

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        navigate("/login");
      },
    }),
  );

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    registerMutation.mutate({
      name,
      email,
      password,
    });
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-slate-950">
          Create your account
        </CardTitle>

        <p className="text-sm text-slate-600">
          Fill in your details to get started.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-slate-800">
              Name
            </Label>

            <Input
              id="name"
              placeholder="Your name"
              className="h-11"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

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
              placeholder="Choose a password"
              className="h-11"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {registerMutation.isError && (
            <p className="text-sm font-medium text-red-600">
              {registerMutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            className="h-11 w-full font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Create account"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-slate-950 underline-offset-4 hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}