/**
 * EN: Interface representing weather data returned by the OpenWeather API
 * - This is a simplified subset of the full API response structure
 */
export interface WeatherData {
  name: string; // EN: City name (e.g., "London")

  main: {
    temp: number;        // EN: Current temperature in Celsius
    feels_like: number;  // EN: What the temperature feels like
    humidity: number;    // EN: Percentage of humidity
  };

  weather: {
    description: string; // EN: Short description (e.g., "light rain")
    icon: string;        // EN: Icon code representing weather visually
  }[];

  wind: {
    speed: number;       // EN: Wind speed in meters per second
  };
}
