
import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  location: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('New York, NY'); // Default location

  useEffect(() => {
    // Mock weather data fetch
    const fetchWeather = () => {
      setLoading(true);
      // In a real app, you would fetch from a weather API using the location
      setTimeout(() => {
        const mockWeather: WeatherData = {
          temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
          condition: ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'][Math.floor(Math.random() * 5)] as any,
          location: location
        };
        setWeather(mockWeather);
        setLoading(false);
      }, 1000);
    };

    fetchWeather();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="text-gray-400" />;
      case 'rainy':
        return <CloudRain className="text-blue-400" />;
      case 'snowy':
        return <CloudSnow className="text-blue-200" />;
      case 'windy':
        return <Wind className="text-blue-300" />;
      default:
        return <Cloud />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{weather?.location}</h3>
          <p className="text-2xl font-bold">{weather?.temperature}°C</p>
          <p className="text-sm text-gray-500 capitalize">{weather?.condition}</p>
        </div>
        <div className="text-2xl">
          {weather && getWeatherIcon(weather.condition)}
        </div>
      </div>
    </div>
  );
};
