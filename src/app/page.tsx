import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, LineChart, TrendingDown, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Track Stocks & Market Trends
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Monitor your favorite stocks, analyze market data, and make informed investment decisions.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/stocks">
                <Button size="lg">
                  Browse Stocks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 p-3 dark:bg-blue-800">
                <TrendingUp className="h-6 w-6 text-blue-500 dark:text-blue-200" />
              </div>
              <h3 className="text-xl font-bold">Real-time Data</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Access real-time stock prices and market data to stay up-to-date.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 p-3 dark:bg-blue-800">
                <LineChart className="h-6 w-6 text-blue-500 dark:text-blue-200" />
              </div>
              <h3 className="text-xl font-bold">Advanced Charts</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Visualize stock performance with interactive charts and analytics.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 p-3 dark:bg-blue-800">
                <BarChart3 className="h-6 w-6 text-blue-500 dark:text-blue-200" />
              </div>
              <h3 className="text-xl font-bold">Portfolio Tracking</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Track your investment portfolio and monitor performance over time.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-red-100 p-3 dark:bg-red-800">
                <TrendingDown className="h-6 w-6 text-red-500 dark:text-red-200" />
              </div>
              <h3 className="text-xl font-bold">Loss Leaders</h3>
              <p className="text-gray-500 dark:text-gray-400">
                <Link href="/loss-leaders" className="text-blue-600 hover:underline">
                  View stocks
                </Link> with the largest percentage drops in your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

