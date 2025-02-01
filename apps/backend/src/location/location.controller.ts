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
    @Req() req: Request,
    @Query("lat") lat?: string,
    @Query("lon") lon?: string
  ) {
    return this.locationService.getLocation(
      req,
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined
    );
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
