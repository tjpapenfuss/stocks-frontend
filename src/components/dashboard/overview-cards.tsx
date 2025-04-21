"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function OverviewCards() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4,782.82</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>0.57%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dow Jones</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">38,949.02</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>0.23%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nasdaq</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">16,825.91</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>0.83%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bitcoin</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$61,247.32</div>
          <div className="flex items-center text-sm text-red-600">
            <TrendingDown className="mr-1 h-4 w-4" />
            <span>1.15%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
