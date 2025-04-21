import { LossLeadersList } from "@/components/loss-leaders/loss-leaders-list";

export const metadata = {
  title: "Top Loss Leaders | StockTracker",
  description: "View the stocks with the biggest percentage drops in your portfolio",
};

export default function LossLeadersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Top Loss Leaders</h1>
        <p className="text-muted-foreground mt-2">
          Stocks in your portfolio with the biggest percentage drops. Consider these for potential buying opportunities or portfolio rebalancing.
        </p>
      </div>
      
      <LossLeadersList />
    </div>
  );
}
