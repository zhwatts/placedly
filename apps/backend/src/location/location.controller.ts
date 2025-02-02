/** @format */

import {
  Controller,
  Get,
  Query,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { WeatherService } from "../weather/weather.service";
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("location")
@Controller("location")
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly weatherService: WeatherService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get location info" })
  @ApiResponse({
    status: 200,
    description: "Returns location information",
  })
  @ApiQuery({ name: "lat", required: false })
  @ApiQuery({ name: "lon", required: false })
  @ApiQuery({ name: "useGeolocation", required: false })
  async getLocation(
    @Req() req: Request,
    @Query("lat") lat?: string,
    @Query("lon") lon?: string,
    @Query("useGeolocation") useGeolocation?: string
  ) {
    console.log("Received request:", { lat, lon, useGeolocation });

    if (lat && lon) {
      // If coordinates are from browser geolocation, use Mapbox for accurate city/state
      if (useGeolocation === "true") {
        const result = await this.locationService.getLocationFromCoordinates(
          parseFloat(lat),
          parseFloat(lon)
        );
        console.log("Geolocation result:", result);
        return result;
      }
    }

    // Fallback to IP-based location
    const result = await this.locationService.getLocationFromIP(req);
    console.log("IP-based location result:", result);
    return result;
  }

  @Get("weather")
  @ApiOperation({ summary: "Get weather info" })
  @ApiResponse({
    status: 200,
    description: "Returns weather information",
  })
  async getWeather(@Query("lat") lat?: string, @Query("lon") lon?: string) {
    if (!lat || !lon) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Missing Parameters",
          message: "Latitude and longitude are required",
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return this.weatherService.getWeather(parseFloat(lat), parseFloat(lon));
  }
}
