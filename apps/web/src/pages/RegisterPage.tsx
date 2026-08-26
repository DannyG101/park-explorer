import { RegisterForm } from "../components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Park Explorer
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Create an account and start exploring
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}