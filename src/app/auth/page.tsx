import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";

export default function AuthenticationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary">YieldLink</h1>
      </div>
      <AuthForm />
    </div>
  );
}
