
import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  location: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('New York, NY'); // Default location
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Try to get user's location on component mount
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would use a reverse geocoding service
        // to convert coordinates to a city name
        // For demonstration, we'll just use the coordinates
        const newLocation = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
        setLocation(newLocation);
        toast.success('Location detected');
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to retrieve your location');
        setIsLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
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
          <button 
            onClick={detectLocation}
            className="mt-2 flex items-center text-xs text-blue-500 hover:text-blue-700"
            disabled={isLocating}
          >
            <MapPin size={12} className="mr-1" />
            {isLocating ? 'Detecting...' : 'Use my location'}
          </button>
        </div>
        <div className="text-2xl">
          {weather && getWeatherIcon(weather.condition)}
        </div>
      </div>
    </div>
  );
};
