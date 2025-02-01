/** @format */

import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({
    status: 200,
    description: "Returns a hello message",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Hello World!",
        },
      },
    },
  })
  getHello(): { message: string } {
    return { message: this.appService.getHello() };
  }
}
