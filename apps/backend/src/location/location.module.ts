/** @format */

import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { WeatherService } from "../weather/weather.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { EnvValidationService } from "../config/env.validation";

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [LocationController],
  providers: [LocationService, WeatherService, EnvValidationService],
})
export class LocationModule {}
