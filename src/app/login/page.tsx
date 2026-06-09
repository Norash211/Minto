import { LoginView } from "@/features/auth";
import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <LoginView />;
}
