/** @format */

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MissingEnvVarException } from "../exceptions/missing-env-var.exception";

@Injectable()
export class EnvValidationService {
  constructor(private configService: ConfigService) {}

  validateOpenWeatherApiKey(): string {
    const apiKey = this.configService.get<string>("OPENWEATHER_API_KEY");
    console.log(
      "API Key found:",
      apiKey ? "Yes (length: " + apiKey.length + ")" : "No"
    );

    if (!apiKey) {
      throw new MissingEnvVarException("OPENWEATHER_API_KEY");
    }
    return apiKey;
  }
}
