"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, Database, RefreshCw, TrendingDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { executeGraphQL } from "@/lib/api"
import { formatCurrency, formatPercentage } from "@/lib/utils"

// Define the type for loss leader items
interface LossLeader {
  symbol: string
  percentageDrop: number
  filledAvgPrice: number
  currentPrice: number
  quantity: number
  dollarLoss: number
}

// Define PageInfo type
interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export function LossLeadersList() {
  const [lossLeaders, setLossLeaders] = useState<LossLeader[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "unknown">("unknown")
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null
  })
  
  async function fetchData(afterCursor?: string | null, reset: boolean = false) {
    try {
      // If we're fetching the first page or refreshing data, set loading to true
      if (!afterCursor || reset) {
        setLoading(true)
      } else {
        // Otherwise, we're loading more data
        setLoadingMore(true)
      }
      
      setError(null)
      
      // Check if we're forcing mock data
      const forceMock = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
      
      // Check API URL
      const hasApiUrl = !!process.env.NEXT_PUBLIC_API_URL
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      
      // If we're forcing mock data or don't have an API URL, we know we'll use mock data
      if (forceMock || !hasApiUrl) {
        console.log("Using mock data due to config");
        setUsingMockData(true)
        setApiStatus("disconnected")
        setLossLeaders(getMockData())
        
        // Simulate page info for mock data
        setPageInfo({
          hasNextPage: afterCursor ? false : true, // If we already have a cursor, no more pages
          hasPreviousPage: !!afterCursor,
          startCursor: null,
          endCursor: afterCursor ? null : "mock-cursor" // Only provide a cursor on first page
        });
        
        return
      }
      
      try {
        console.log("Attempting to fetch real data from GraphQL API");
        
        // GraphQL query for loss leaders with userId parameter and pagination
        const query = `
          query GetLossLeaders($afterCursor: String) {
            lossLeaders(userId: "e4dfe1af-f4c3-4c7f-945d-28d96546423f" accountId: "50bf8c11-d889-4eaa-8122-074cd0abf01b", after: $afterCursor, first: 10) {
              edges {
                cursor
                node {
                  symbol
                  percentageDrop
                  filledAvgPrice
                  currentPrice
                  quantity
                  dollarLoss
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              totalCount
            }
          }
        `;
        
        const variables = { afterCursor };
        console.log("Query variables:", variables);
        
        const response = await executeGraphQL(query, variables);
        console.log("GraphQL response:", response);
        
        if (response && response.lossLeaders && response.lossLeaders.edges) {
          // Extract the nodes from the edges
          const lossLeadersData = response.lossLeaders.edges.map((edge: any) => edge.node);
          console.log("Processed data:", lossLeadersData);
          
          // Save the page info for pagination
          setPageInfo(response.lossLeaders.pageInfo);
          
          // If we're loading more (not the first page), append to existing data
          // Otherwise, replace the data
          if (afterCursor && !reset) {
            setLossLeaders(prev => [...prev, ...lossLeadersData]);
          } else {
            setLossLeaders(lossLeadersData);
          }
          
          setUsingMockData(false);
          setApiStatus("connected");
        } else {
          console.log("Invalid response format:", response);
          throw new Error("Invalid response format from GraphQL API");
        }
      } catch (apiError) {
        console.error("GraphQL API error:", apiError);
        
        // Fall back to mock data
        if (!afterCursor || reset) {
          // Only reset to mock data if this is a fresh fetch, not when paginating
          setLossLeaders(getMockData());
          setUsingMockData(true);
          setApiStatus("disconnected");
          
          // Simulate page info for mock data
          setPageInfo({
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: "mock-cursor"
          });
        }
      }
    } catch (err) {
      console.error("Error in fetchData:", err)
      setError("Failed to load loss leaders. Please check your API connection and try again.")
      
      if (!afterCursor || reset) {
        // Only reset to mock data if this is a fresh fetch, not when paginating
        setLossLeaders(getMockData())
        setUsingMockData(true)
        setApiStatus("disconnected")
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }
  
  // Function to load more data
  async function loadMore() {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      await fetchData(pageInfo.endCursor, false);
    }
  }
  
  // Function to get mock data
  function getMockData(): LossLeader[] {
    return [
      { 
        symbol: "AAPL", 
        percentageDrop: 5.32, 
        filledAvgPrice: 192.58, 
        currentPrice: 182.52, 
        quantity: 10,
        dollarLoss: -100.60
      },
      { 
        symbol: "TSLA", 
        percentageDrop: 12.45, 
        filledAvgPrice: 202.64, 
        currentPrice: 177.41, 
        quantity: 5,
        dollarLoss: -126.15
      },
      { 
        symbol: "NVDA", 
        percentageDrop: 8.21, 
        filledAvgPrice: 893.27, 
        currentPrice: 820.06, 
        quantity: 2,
        dollarLoss: -146.42
      },
      { 
        symbol: "META", 
        percentageDrop: 6.87, 
        filledAvgPrice: 509.32, 
        currentPrice: 474.33, 
        quantity: 3,
        dollarLoss: -104.97
      },
      { 
        symbol: "AMZN", 
        percentageDrop: 5.73, 
        filledAvgPrice: 189.62, 
        currentPrice: 178.75, 
        quantity: 8,
        dollarLoss: -86.96
      }
    ];
  }
  
  useEffect(() => {
    fetchData(null, true)
  }, [])
  
  if (loading && lossLeaders.length === 0) {
    return <LossLeadersListSkeleton />
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {apiStatus !== "unknown" && (
            <Badge variant={apiStatus === "connected" ? "outline" : "secondary"}>
              <Database className="h-3 w-3 mr-1" />
              {usingMockData ? "Using Demo Data" : "Live Data"}
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchData(null, true)} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <p className="text-xs">Using demo data instead. Check that your GraphQL API is running and accessible.</p>
          </AlertDescription>
        </Alert>
      )}
      
      {lossLeaders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Loss Leaders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No loss leaders found in your portfolio.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lossLeaders.map((stock) => (
              <Link href={`/stocks/${stock.symbol}`} key={stock.symbol} className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{stock.symbol}</CardTitle>
                      <div className="flex items-center text-destructive font-medium">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        {formatPercentage(stock.percentageDrop)}
                      </div>
                    </div>
                    <CardDescription>Current: {formatCurrency(stock.currentPrice)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">FilledAvgPrice</p>
                        <p className="font-medium">{formatCurrency(stock.filledAvgPrice)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{stock.quantity}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Loss</span>
                      <span className="text-destructive font-semibold">{formatCurrency(stock.dollarLoss)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          
          {loadingMore && (
            <div className="mt-4">
              <LossLeadersListSkeleton />
            </div>
          )}
          
          {pageInfo.hasNextPage && !loadingMore && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={loadMore} 
                variant="outline"
                disabled={loadingMore}
                className="w-full max-w-xs"
              >
                {loadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LossLeadersListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-32 mt-1" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between items-center">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}