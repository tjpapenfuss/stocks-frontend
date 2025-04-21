"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { stocksApi } from "@/lib/api";

interface Position {
  symbol: string;
  buy_price: number;
  original_quantity: number;
  remaining_quantity: number;
  buy_datetime: string;
  buy_order_id: string;
}

interface PositionEdge {
  cursor: string;
  node: Position;
}

interface PositionsData {
  edges: PositionEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  totalCount: number;
}

export default function StockTable() {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<PositionsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true);
        const data = await stocksApi.getPositions();
        setPositions(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Failed to load positions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading stock data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!positions || positions.edges.length === 0) {
    return <div className="text-center py-4">No positions found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Buy Price</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Remaining</TableHead>
          <TableHead className="text-right">Purchase Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.edges.map(({ node }) => (
          <TableRow key={`${node.symbol}-${node.buy_order_id}`}>
            <TableCell className="font-medium">
              <Link href={`/stocks/${node.symbol}`} className="hover:underline text-blue-600">
                {node.symbol}
              </Link>
            </TableCell>
            <TableCell className="text-right">${node.buy_price.toFixed(2)}</TableCell>
            <TableCell className="text-right">{node.original_quantity}</TableCell>
            <TableCell className="text-right">{node.remaining_quantity}</TableCell>
            <TableCell className="text-right">
              {new Date(node.buy_datetime).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
