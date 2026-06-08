import {
  AlertCircle,
  Archive,
  ArrowRightLeft,
  HandCoins,
  Home,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavigationItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/accounts", label: "Cuentas", icon: WalletCards },
  { href: "/buckets", label: "Apartados", icon: Archive },
  { href: "/transactions", label: "Movimientos", icon: ArrowRightLeft },
  { href: "/forecast", label: "Proyección", icon: TrendingUp },
  { href: "/debts", label: "Deudas", icon: AlertCircle },
  { href: "/loans-given", label: "Dinero prestado", icon: HandCoins },
];
