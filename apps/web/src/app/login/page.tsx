import { Container } from "../../components/Container";
import { LoginForm } from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Login</h1>
        <p className="mt-1 text-sm text-white/60">Access your account.</p>
        <div className="mt-8 max-w-md">
          <LoginForm />
        </div>
      </Container>
    </div>
  );
}
