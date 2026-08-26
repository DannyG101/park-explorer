import { LoginForm } from "../components/auth/LoginForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}