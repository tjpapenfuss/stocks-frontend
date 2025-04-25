import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { executeGraphQL } from "@/lib/api";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowLeft, Calendar } from "lucide-react";

// Define the Position type
interface Position {
  accountName: string | null;
  availableShares: number;
  averageEntryPrice: number;
  id: string;
  isOpen: boolean;
  lastPrice: number;
  lastPriceUpdatedAt: Date;
  marketValue: number;
  openedAt: Date;
  realizedPlYtd: number;
  symbol: string;
  totalCost: number;
  totalShares: number;
  unrealizedPl: number;
  unrealizedPlPercent: number;
}

// Define the Transaction type
interface Transaction {
  symbol: string;
  status: string;
  side: string;
  remainingQty: number;
  realizedGainLoss: number;
  orderType: string;
  id: string;
  filledQty: number;
  filledAvgPrice: number;
  filledAt: string;
  createdAt: string;
  clientOrderId: string;
  accountName: string;
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
      query singlePosition($symbol: String!) {
        singlePosition(symbol: $symbol, userId: "e4dfe1af-f4c3-4c7f-945d-28d96546423f" accountId: "50bf8c11-d889-4eaa-8122-074cd0abf01b") {
          accountName
          availableShares
          averageEntryPrice
          id
          isOpen
          lastPrice
          lastPriceUpdatedAt
          marketValue
          openedAt
          realizedPlYtd
          symbol
          totalCost
          totalShares
          unrealizedPl
          unrealizedPlPercent
        }
      }
    `;
    
    const variables = { symbol };
    const data = await executeGraphQL(query, variables);
    
    return data.singlePosition;
  } catch (error) {
    console.error(`Error fetching position data for ${symbol}:`, error);
    return null;
  }
}

// Fetch transaction data function
async function getTransactionData(symbol: string): Promise<Transaction[]> {
  try {
    // GraphQL query for transactions related to a specific symbol
    const query = `
      query positionTransactions($symbol: String!) {
        positionTransactions(
          userId: "e4dfe1af-f4c3-4c7f-945d-28d96546423f"
          accountId: "50bf8c11-d889-4eaa-8122-074cd0abf01b"
          symbol: $symbol
        ) {
          symbol
          status
          side
          remainingQty
          realizedGainLoss
          orderType
          id
          filledQty
          filledAvgPrice
          filledAt
          createdAt
          clientOrderId
          accountName
        }
      }
    `;
    
    const variables = { symbol };
    const data = await executeGraphQL(query, variables);
    
    return data.positionTransactions || [];
  } catch (error) {
    console.error(`Error fetching transaction data for ${symbol}:`, error);
    return [];
  }
}

export default async function StockPage({ params }: { params: { symbol: string } }) {
  // Fix: await params before accessing symbol
  const resolvedParams = await Promise.resolve(params);
  const symbol = resolvedParams.symbol.toUpperCase();
  
  try {
    const stockData = await getPositionData(symbol);
    const transactionData = await getTransactionData(symbol);
    
    console.log(`Fetched stock data for ${symbol}:`, stockData);
    console.log(`Fetched transaction data for ${symbol}:`, transactionData);
    
    if (!stockData) {
      return notFound();
    }
    
    // Calculate current price (in a real app you would fetch the current price)
    const currentPrice = stockData.lastPrice; // Simulating a 12.5% loss
    
    // Calculate loss values
    const totalLoss = stockData.unrealizedPl;
    const lossPercentage = stockData.unrealizedPlPercent;
    
    // Calculate totals
    const totalInvestment = stockData.totalCost;
    const currentValue = stockData.marketValue;
    
    // Format purchase date
    const purchaseDate = new Date(stockData.openedAt);
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
              <p className="text-2xl font-semibold">$ {stockData.averageEntryPrice.toFixed(2)}</p>
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
              <p className="text-sm text-muted-foreground mb-1">P/L Amount</p>
              <p className={`text-2xl font-semibold ${totalLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                $ {Math.abs(totalLoss).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6">
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-1">P/L Percentage</p>
              <p className={`text-2xl font-semibold ${lossPercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                % {Math.abs(lossPercentage).toFixed(2)}
              </p>
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
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="text-lg font-medium">{stockData.availableShares}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-lg font-medium">{formatCurrency(currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Quantity</p>
                    <p className="text-lg font-medium">{stockData.availableShares}</p>
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
                
                <div className="grid grid-cols-2 gap-y-6 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Buy Order ID</p>
                    <p className="text-lg font-medium">{stockData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.averageEntryPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-lg font-medium">{formattedDate}, {formattedTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Shares</p>
                    <p className="text-lg font-medium">{stockData.availableShares}</p>
                  </div>
                </div>
                
                {/* Transaction History Section */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Transaction History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-medium">Date</th>
                          <th className="text-left py-3 font-medium">Type</th>
                          <th className="text-right py-3 font-medium">Quantity</th>
                          <th className="text-right py-3 font-medium">Price</th>
                          <th className="text-right py-3 font-medium">Total</th>
                          <th className="text-right py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionData.length > 0 ? (
                          transactionData.map((transaction) => {
                            // Format the transaction date
                            const txDate = new Date(transaction.filledAt || transaction.createdAt);
                            const txFormattedDate = txDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            });
                            const txFormattedTime = txDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                            
                            // Calculate total value
                            const totalValue = transaction.filledQty * (transaction.filledAvgPrice || 0);
                            
                            return (
                              <tr key={transaction.id} className="border-b">
                                <td className="py-3">
                                  <div>{txFormattedDate}</div>
                                  <div className="text-xs text-muted-foreground">{txFormattedTime}</div>
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    transaction.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {transaction.side.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-3 text-right">{transaction.filledQty}</td>
                                <td className="py-3 text-right">{formatCurrency(transaction.filledAvgPrice || 0)}</td>
                                <td className="py-3 text-right">{formatCurrency(totalValue)}</td>
                                <td className="py-3 text-right">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    transaction.status === 'filled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {transaction.status.toUpperCase()}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-muted-foreground">
                              No transaction history available for this position.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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