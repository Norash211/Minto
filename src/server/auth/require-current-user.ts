import { redirect } from "next/navigation";
import { getCurrentUser } from "./get-current-user";

export async function requireCurrentUser() {
  const label = `[perf] requireCurrentUser ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  console.time(label);
  const user = await getCurrentUser();

  if (!user) {
    console.timeEnd(label);
    redirect("/login");
  }

  console.timeEnd(label);
  return user;
}
