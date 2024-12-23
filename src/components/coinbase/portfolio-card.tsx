// src/components/coinbase/portfolio-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { RefreshCw, Loader2, Wallet } from "lucide-react"

interface Portfolio {
  portfolio_id: string;
  name: string;
  entity_id: string;
}

interface PortfolioCardProps {
  data?: Portfolio[];
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
}

export function PortfolioCard({ data, isLoading, error, onRefresh }: PortfolioCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coinbase Portfolios</CardTitle>
        <button 
          onClick={onRefresh}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Refresh portfolio data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((portfolio) => (
            <div 
              key={portfolio.portfolio_id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-accent/50"
            >
              <Wallet className="h-5 w-5 mt-1" />
              <div className="flex-1 space-y-1">
                <p className="font-medium">{portfolio.name}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Portfolio ID: {portfolio.portfolio_id}</p>
                  <p>Entity ID: {portfolio.entity_id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}