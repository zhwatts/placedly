/** @format */

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { NestExpressApplication } from "@nestjs/platform-express";

const server = express();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server)
  );

  const allowedOrigins = [
    "https://www.placedly.com",
    "https://placedly.com",
    "https://placedly-frontend.vercel.app",
    "http://localhost:5173", // Keep local development working
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Placedly API")
    .setDescription("The Placedly API description")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("placedly")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    ],
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.init();
  return app;
}

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await bootstrap();
  }
  server(req, res);
}
