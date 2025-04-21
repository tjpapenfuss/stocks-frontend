import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewCards from "@/components/dashboard/overview-cards";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your market overview and portfolio at a glance.</p>
      </div>
      
      <OverviewCards />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Gainers</CardTitle>
            <CardDescription>Stocks with the highest gains today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { symbol: "NVDA", name: "NVIDIA Corp.", change: 4.32, changePercent: 1.87 },
                { symbol: "AMD", name: "Advanced Micro Devices", change: 3.65, changePercent: 1.54 },
                { symbol: "MSFT", name: "Microsoft Corp.", change: 2.63, changePercent: 0.63 },
              ].map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{stock.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Losers</CardTitle>
            <CardDescription>Stocks with the largest losses today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { symbol: "TSLA", name: "Tesla Inc.", change: -2.95, changePercent: -1.64 },
                { symbol: "NKE", name: "Nike Inc.", change: -1.78, changePercent: -1.42 },
                { symbol: "GOOGL", name: "Alphabet Inc.", change: -0.89, changePercent: -0.52 },
              ].map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>{Math.abs(stock.changePercent).toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>Your tracked stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your watchlist will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}