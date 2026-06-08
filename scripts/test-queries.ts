import { prisma } from "@/server/db/prisma";
import { getAccounts, getDashboardSummary, getRecentTransactions } from "@/server/queries";

const demoEmail = "demo@minto.app";

function serializeForConsole(value: unknown) {
  return JSON.parse(
    JSON.stringify(value, (_key, item) => {
      if (item instanceof Date) {
        return item.toISOString();
      }

      if (item && typeof item === "object" && "toString" in item && item.constructor.name === "Decimal") {
        return item.toString();
      }

      return item;
    }),
  );
}

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: demoEmail,
    },
  });

  if (!user) {
    throw new Error(`Demo user not found: ${demoEmail}. Run npx prisma db seed first.`);
  }

  const [accounts, recentTransactions, dashboardSummary] = await Promise.all([
    getAccounts(user.id),
    getRecentTransactions(user.id),
    getDashboardSummary(user.id),
  ]);

  console.log("Accounts");
  console.dir(serializeForConsole(accounts), { depth: null });

  console.log("Recent Transactions");
  console.dir(serializeForConsole(recentTransactions), { depth: null });

  console.log("Dashboard Summary");
  console.dir(serializeForConsole(dashboardSummary), { depth: null });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
