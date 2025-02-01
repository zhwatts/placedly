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
  async getLocation(
    @Req() request: Request,
    @Query("lat") lat?: string,
    @Query("lon") lon?: string
  ) {
    try {
      // If coordinates are provided, use them as primary source
      if (lat && lon) {
        return await this.locationService.getLocationFromCoordinates(
          parseFloat(lat),
          parseFloat(lon)
        );
      }

      // Fallback to IP-based location
      const ip =
        request.headers["x-forwarded-for"]?.toString() ||
        request.ip ||
        request.socket.remoteAddress ||
        "127.0.0.1";

      return this.locationService.getLocationFromIP(ip);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Location Service Error",
          message: "Error determining location",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
