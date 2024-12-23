// src/components/crypto/crypto-price-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { RefreshCw, Loader2, TrendingUp, TrendingDown, Bitcoin, Coins, Clock } from "lucide-react"

interface CryptoData {
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

interface CryptoPriceCardProps {
  data: {
    btc?: CryptoData | null;
    eth?: CryptoData | null;
  };
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
}

export function CryptoPriceCard({ data, isLoading, error, onRefresh }: CryptoPriceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatTimeForZone = (dateString: string, timeZone: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone
    });
  };

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

  const PriceRow = ({ crypto }: { crypto: CryptoData }) => {
    const isPositiveChange = crypto.price_change_percentage_24h >= 0;
    return (
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
          {crypto.symbol === 'BTC' ? (
            <Bitcoin className="h-6 w-6 text-orange-500" />
          ) : (
            <Coins className="h-6 w-6 text-blue-500" />
          )}
          <div>
            <p className="font-medium">{crypto.symbol}/USD</p>
            <div className="flex items-center space-x-2">
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl font-bold">{formatPrice(crypto.current_price)}</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Crypto Prices</CardTitle>
        <button 
          onClick={onRefresh}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Refresh price data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.btc && <PriceRow crypto={data.btc} />}
          {data.btc && data.eth && <div className="border-t border-border" />}
          {data.eth && <PriceRow crypto={data.eth} />}
          
          {/* Time section with both zones */}
          {data.btc && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <div className="grid grid-cols-2 gap-4 w-full text-sm">
                  <div>
                    <p className="font-medium text-foreground">Abu Dhabi (GST)</p>
                    <p>{formatTimeForZone(data.btc.last_updated, 'Asia/Dubai')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">New York (EST)</p>
                    <p>{formatTimeForZone(data.btc.last_updated, 'America/New_York')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}