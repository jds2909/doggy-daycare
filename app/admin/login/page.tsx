import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Owner sign in</h1>
      <p className="mt-3">Manage booking enquiries.</p>
      {denied === "1" && <p role="alert" className="mt-4 text-red-800">This account does not have admin access.</p>}
      <LoginForm />
    </div>
  );
}
