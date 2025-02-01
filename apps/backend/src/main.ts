/** @format */

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";
import serverlessExpress from "@vendia/serverless-express";

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp)
  );
  app.enableCors(); // Enable CORS for API access

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Placedly API")
    .setDescription("The Placedly API description")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("placedly")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.init(); // Initialize NestJS app within Express
}

// Bootstrap the NestJS app
bootstrap();

// Export the handler for Vercel's Serverless Functions
export const handler = serverlessExpress({ app: expressApp });
