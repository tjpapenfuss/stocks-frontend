import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockChart from "@/components/stocks/stock-chart";
import { stocksApi } from "@/lib/api";

// This function runs on the server
export async function generateMetadata({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  return {
    title: `${symbol} Stock | StockTracker`,
    description: `View details and performance for ${symbol} stock`,
  };
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  
  try {
    const stockData = await stocksApi.getPosition(symbol);
    
    if (!stockData) {
      return notFound();
    }
    
    // Calculate percentage change from buy price to current (in a real app you would 
    // fetch the current price from another endpoint, here we're just using mock data)
    const currentPrice = stockData.buy_price * 1.05; // Mock current price 5% above buy price
    const change = currentPrice - stockData.buy_price;
    const changePercent = (change / stockData.buy_price) * 100;

    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold">${currentPrice.toFixed(2)}</span>
            <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="position">Your Position</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Information about {symbol} will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chart">
            <Card>
              <CardHeader>
                <CardTitle>Stock Price Chart</CardTitle>
                <CardDescription>Historical price data for {symbol}</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <StockChart symbol={symbol} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="position">
            <Card>
              <CardHeader>
                <CardTitle>Your Position</CardTitle>
                <CardDescription>Details of your current holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Buy Price</p>
                    <p className="text-lg font-medium">${stockData.buy_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Original Quantity</p>
                    <p className="text-lg font-medium">{stockData.original_quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Quantity</p>
                    <p className="text-lg font-medium">{stockData.remaining_quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <p className="text-lg font-medium">
                      {new Date(stockData.buy_datetime).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-lg font-medium">
                      ${(currentPrice * stockData.remaining_quantity).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit/Loss</p>
                    <p className={`text-lg font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(change * stockData.remaining_quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return notFound();
  }
}
