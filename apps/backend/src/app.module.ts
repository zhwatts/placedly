/** @format */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LocationModule } from "./location/location.module";
import cors from "cors";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LocationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer) {
    consumer
      .apply(cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
      }))
      .forRoutes("*");
  }
}
