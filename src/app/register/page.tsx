import { RegisterView } from "@/features/auth";
import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <RegisterView />;
}
