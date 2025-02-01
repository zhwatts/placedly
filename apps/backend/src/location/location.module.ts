/** @format */

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { WeatherService } from "../weather/weather.service";
import { EnvValidationService } from "../config/env.validation";

@Module({
  imports: [HttpModule],
  controllers: [LocationController],
  providers: [LocationService, WeatherService, EnvValidationService],
})
export class LocationModule {}
