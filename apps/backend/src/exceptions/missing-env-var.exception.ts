/** @format */

import { HttpException, HttpStatus } from "@nestjs/common";

export class MissingEnvVarException extends HttpException {
  constructor(varName: string) {
    super(
      {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: "Configuration Error",
        message: `Missing environment variable: ${varName}`,
      },
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}
