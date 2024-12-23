// src/components/coinbase/portfolio-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { RefreshCw, Loader2, Wallet, Info } from "lucide-react"

interface Portfolio {
  id: string;
  entity_id: string;
  organization_id: string;
}

interface PortfolioCardProps {
  data?: Portfolio[];
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
}

export function PortfolioCard({ data, isLoading, error, onRefresh }: PortfolioCardProps) {
  // Debug logging for full data inspection
  console.log('Full Portfolio Data:', {
    data,
    isLoading,
    error
  });

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
        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((portfolio) => (
              <div 
                key={portfolio.id}  // Ensure this is a unique identifier
                className="flex items-start space-x-3 p-3 rounded-lg bg-accent/50 mb-2"
              >
                <Wallet className="h-5 w-5 mt-1" />
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Entity ID: {portfolio.entity_id}</p>
                    <p>Organization ID: {portfolio.organization_id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Info className="h-5 w-5" />
            <p>No portfolios found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}