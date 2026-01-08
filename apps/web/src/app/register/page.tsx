import { Container } from "../../components/Container";
import { RegisterForm } from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-extrabold text-white">Register</h1>
        <p className="mt-1 text-sm text-white/60">Create a new account.</p>
        <div className="mt-8 max-w-md">
          <RegisterForm />
        </div>
      </Container>
    </div>
  );
}
