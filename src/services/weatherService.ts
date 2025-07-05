// EN: Loads environment-specific configuration values
import { ENV_CONFIG } from '../config/envConfig';

// EN: Axios for making HTTP requests to external APIs
import axios from 'axios';

// EN: Interface for weather API response shape
import { WeatherData } from '../types/weatherType';

// EN: Logger utility for structured logging
import { logger } from '../utils/logger';

// EN: Ensure required API key is present at startup
if (!ENV_CONFIG.OPENWEATHER_API_KEY) {
  throw new Error('OPENWEATHER_API_KEY environment variable is not set');
}

/**
 * EN: Fetches current weather data from OpenWeather API
 * @param city Name of the city (e.g., "Istanbul")
 * @returns Weather data for the specified city
 * @throws Error if the API request fails or the city is invalid
 */
export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const response = await axios.get<WeatherData>(ENV_CONFIG.BASE_URL, {
      params: {
        q: city,
        appid: ENV_CONFIG.OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    logger.debug(`Weather data successfully fetched from API for city: ${city}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`OpenWeather API error for city "${city}": ${error.message}`);
    } else {
      logger.error(`Unknown error during OpenWeather API call for city: ${city}`);
    }

    throw new Error('Could not fetch weather data for city: ' + city);
  }
}
