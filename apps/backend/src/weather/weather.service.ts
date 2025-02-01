/** @format */

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { EnvValidationService } from "../config/env.validation";

interface OpenWeatherResponse {
  weather: Array<{
    description: string;
    main: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
}

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly envValidationService: EnvValidationService
  ) {}

  async getWeather(lat: number, lon: number) {
    try {
      const apiKey = this.envValidationService.validateOpenWeatherApiKey();
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

      // Add this line temporarily for debugging
      console.log("Weather API URL:", url);

      const { data } = await firstValueFrom<{ data: OpenWeatherResponse }>(
        this.httpService.get(url)
      );

      if (!data.weather?.[0] || !data.main) {
        throw new Error("Invalid weather data format");
      }

      // Add this line for debugging
      console.log("Weather icon code:", data.weather[0].icon);

      return {
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
      };
    } catch (error) {
      console.error(
        "Weather API Error:",
        error.response?.data || error.message
      );

      // Check if it's an API key issue
      if (error.response?.data?.cod === 401) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: "Weather API Error",
            message: "Invalid API key",
          },
          HttpStatus.UNAUTHORIZED
        );
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        throw new HttpException(
          {
            status: HttpStatus.TOO_MANY_REQUESTS,
            error: "Weather API Error",
            message: "Rate limit exceeded",
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      throw new HttpException(
        {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: "Weather Service Unavailable",
          message: "Unable to fetch weather information",
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
