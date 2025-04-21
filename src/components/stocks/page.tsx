import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StockTable from "@/components/stocks/stock-table";
import { Search } from "lucide-react";

export default function StocksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Stocks</h1>
        <p className="text-muted-foreground">
          Browse and search for stocks across different markets.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search by company name or symbol..."
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Stocks</CardTitle>
          <CardDescription>
            The most actively traded stocks in the market.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StockTable />
        </CardContent>
      </Card>
    </div>
  );
}
