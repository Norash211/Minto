import { ForecastView } from "@/features/forecast";
import { requireCurrentUser } from "@/server/auth";
import { getForecast } from "@/server/queries";

export default async function ForecastPage() {
  const user = await requireCurrentUser();
  const forecast = await getForecast(user.id);

  return <ForecastView forecast={forecast} />;
}
