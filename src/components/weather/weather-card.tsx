// src/components/weather/weather-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Sun, Cloud, CloudRain, Loader2, RefreshCw, Clock } from "lucide-react"

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  date: string;
  timestamp: string;
  estTime: string;
}

interface WeatherCardProps {
  data?: WeatherData | null;
  isLoading: boolean;
  error?: string;
  onRefresh: () => void;
}

export function WeatherCard({ data, isLoading, error, onRefresh }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
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

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather</CardTitle>
        <button 
          onClick={onRefresh}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Refresh weather data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{data.location}</h3>
              <p className="text-muted-foreground">{data.date}</p>
              <p className="text-3xl font-bold mt-2">{data.temperature}°F</p>
              <p className="text-muted-foreground mt-1">{data.description}</p>
            </div>
            {getWeatherIcon(data.condition)}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <div className="grid grid-cols-2 gap-4 w-full text-sm">
                <div>
                  <p className="font-medium text-foreground">Abu Dhabi (GST)</p>
                  <p>{data.timestamp}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">New York (EST)</p>
                  <p>{data.estTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}