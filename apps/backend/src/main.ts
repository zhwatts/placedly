/** @format */

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: true,
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
