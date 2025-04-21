"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Button } from "@/components/ui/button";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock function to generate random historical data
function generateHistoricalData(days: number, basePrice: number) {
  const data = [];
  const labels = [];
  let price = basePrice;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    
    // Generate a random price movement
    const change = (Math.random() - 0.5) * 5;
    price = Math.max(0, price + change);
    data.push(price);
  }
  
  return { labels, data };
}

interface StockChartProps {
  symbol: string;
}

export default function StockChart({ symbol }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y" | "5Y">("1M");
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    // Set base price based on symbol - this is just for demo
    let basePrice = 150;
    if (symbol === "MSFT") basePrice = 400;
    if (symbol === "GOOGL") basePrice = 170;
    
    // Generate different data based on time range
    let days = 30;
    if (timeRange === "3M") days = 90;
    if (timeRange === "6M") days = 180;
    if (timeRange === "1Y") days = 365;
    if (timeRange === "5Y") days = 365 * 5;
    
    const { labels, data } = generateHistoricalData(days, basePrice);
    
    setChartData({
      labels,
      datasets: [
        {
          label: symbol,
          data: data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.2,
        },
      ],
    });
  }, [timeRange, symbol]);
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };
  
  if (!chartData) {
    return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant={timeRange === "1M" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setTimeRange("1M")}
        >
          1M
        </Button>
        <Button 
          variant={timeRange === "3M" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setTimeRange("3M")}
        >
          3M
        </Button>
        <Button 
          variant={timeRange === "6M" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setTimeRange("6M")}
        >
          6M
        </Button>
        <Button 
          variant={timeRange === "1Y" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setTimeRange("1Y")}
        >
          1Y
        </Button>
        <Button 
          variant={timeRange === "5Y" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setTimeRange("5Y")}
        >
          5Y
        </Button>
      </div>
      
      <div className="h-80">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
