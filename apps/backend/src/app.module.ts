/** @format */

import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import * as cors from "cors";
import { LocationModule } from "./location/location.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: [
            process.env.FRONTEND_URL || "http://localhost:5173",
            /^http:\/\/localhost:\d+$/,  // Allow all localhost ports for development
          ],
          credentials: true,
        })
      )
      .forRoutes("*");
  }
}
