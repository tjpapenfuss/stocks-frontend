import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
          <div className="space-y-4">
            {[
              { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 1.25, changePercent: 0.69 },
              { symbol: "MSFT", name: "Microsoft Corp.", price: 417.88, change: 2.63, changePercent: 0.63 },
              { symbol: "GOOGL", name: "Alphabet Inc.", price: 171.03, change: -0.89, changePercent: -0.52 },
              { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.75, change: 1.32, changePercent: 0.74 },
              { symbol: "TSLA", name: "Tesla Inc.", price: 177.27, change: -2.95, changePercent: -1.64 },
            ].map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stock.price.toFixed(2)}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
