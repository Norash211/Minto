import { ForecastView } from "@/features/forecast";
import { requireCurrentUser } from "@/server/auth";

export default async function ForecastPage() {
  await requireCurrentUser();

  return <ForecastView />;
}
