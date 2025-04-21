import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { executeGraphQL } from "@/lib/api";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowLeft, Calendar } from "lucide-react";

// Define the Position type
interface Position {
  symbol: string;
  buyPrice: number;
  originalQuantity: number;
  remainingQuantity: number;
  buyDatetime: string;
  buyOrderId: string;
}

// This function runs on the server
export async function generateMetadata({ params }: { params: { symbol: string } }) {
  // Fix: await params before accessing symbol
  const resolvedParams = await Promise.resolve(params);
  const symbol = resolvedParams.symbol.toUpperCase();
  
  return {
    title: `${symbol} Details | StockTracker`,
    description: `View detailed information about ${symbol} stock position`,
  };
}

// Fetch position data function
async function getPositionData(symbol: string): Promise<Position | null> {
  try {
    // GraphQL query for a specific position
    const query = `
      query GetPosition($symbol: String!) {
        position(symbol: $symbol, userId: "94c779e0-d045-44a2-b507-23fd7972ae41") {
          symbol
          buyPrice
          originalQuantity
          remainingQuantity
          buyDatetime
          buyOrderId
        }
      }
    `;
    
    const variables = { symbol };
    const data = await executeGraphQL(query, variables);
    
    return data.position;
  } catch (error) {
    console.error(`Error fetching position data for ${symbol}:`, error);
    return null;
  }
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  // Fix: await params before accessing symbol
  const resolvedParams = await Promise.resolve(params);
  const symbol = resolvedParams.symbol.toUpperCase();
  
  try {
    const stockData = await getPositionData(symbol);
    
    if (!stockData) {
      return notFound();
    }
    
    // Calculate current price (in a real app you would fetch the current price)
    const currentPrice = stockData.buyPrice * 0.875; // Simulating a 12.5% loss
    
    // Calculate loss values
    const lossPerShare = stockData.buyPrice - currentPrice;
    const totalLoss = lossPerShare * stockData.remainingQuantity;
    const lossPercentage = (lossPerShare / stockData.buyPrice) * 100;
    
    // Calculate totals
    const totalInvestment = stockData.buyPrice * stockData.originalQuantity;
    const currentValue = currentPrice * stockData.remainingQuantity;
    
    // Format purchase date
    const purchaseDate = new Date(stockData.buyDatetime);
    const formattedDate = purchaseDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = purchaseDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className="space-y-6">
        {/* Back button */}
        <Link 
          href="/loss-leaders" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{symbol} Details</h1>
          <p className="text-muted-foreground mt-1">View detailed information about this stock position</p>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-1">Purchase Price</p>
              <p className="text-2xl font-semibold">$ {stockData.buyPrice.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="text-2xl font-semibold">$ {currentPrice.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-1">Loss Amount</p>
              <p className="text-2xl font-semibold text-red-500">$ {totalLoss.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-1">Loss Percentage</p>
              <p className="text-2xl font-semibold text-red-500">% {lossPercentage.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Details</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Position Summary</h3>
                <p className="text-sm text-muted-foreground mb-4">Current position details for {symbol}</p>
                
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Original Quantity</p>
                    <p className="text-lg font-medium">{stockData.originalQuantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-lg font-medium">{formatCurrency(currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Quantity</p>
                    <p className="text-lg font-medium">{stockData.remainingQuantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Loss</p>
                    <p className="text-lg font-medium text-red-500">{formatCurrency(totalLoss)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investment</p>
                    <p className="text-lg font-medium">{formatCurrency(totalInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loss Percentage</p>
                    <p className="text-lg font-medium text-red-500">{lossPercentage.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Purchase Details Tab */}
          <TabsContent value="purchase" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Purchase Information</h3>
                <p className="text-sm text-muted-foreground mb-4">Details about when this position was acquired</p>
                
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Buy Order ID</p>
                    <p className="text-lg font-medium">{stockData.buyOrderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.buyPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-lg font-medium">{formattedDate}, {formattedTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity Purchased</p>
                    <p className="text-lg font-medium">{stockData.originalQuantity}</p>
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