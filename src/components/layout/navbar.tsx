import Link from "next/link";
import { BarChart3, Home, ListFilter, TrendingDown } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BarChart3 className="h-6 w-6" />
          <span>StockTracker</span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/stocks" className="flex items-center gap-1 text-sm font-medium">
            <ListFilter className="h-4 w-4" />
            Stocks
          </Link>
          <Link href="/loss-leaders" className="flex items-center gap-1 text-sm font-medium">
            <TrendingDown className="h-4 w-4" />
            Loss Leaders
          </Link>
        </nav>
      </div>
    </header>
  );
}