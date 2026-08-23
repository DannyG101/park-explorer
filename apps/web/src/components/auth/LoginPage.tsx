import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  )
}
