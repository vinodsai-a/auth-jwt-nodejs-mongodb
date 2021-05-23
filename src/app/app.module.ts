import { Module } from "@nestjs/common";
import { readFileSync } from "fs";
import { resolve } from "path";
import { IConfig } from "config";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerModule } from "nestjs-pino";
import * as pino from "pino";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { ConfigModule, CONFIG } from "../config";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
            level: process.env.NODE_ENV !== "production" ? "debug" : "info",
            redact: {
              paths: ['req.headers["authorization"]'],
              censor: "***",
            },
            serializers: {
              err: pino.stdSerializers.err,
              req: pino.stdSerializers.req,
            },
            // autoLogging: false,
          },
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configProvider: IConfig) => {
        const uri = process.env.DB_URI;
        const username = process.env.DB_USERNAME;
        const password = process.env.DB_PASSWORD;
        const connectionString = `mongodb://${username}:${password}@${uri}`;
        const sslValidate = configProvider.get<string>("db.sslValidate");
        let sslConfig = {};

        if (sslValidate) {
          const sslCA = readFileSync(
            resolve(configProvider.get<string>("db.sslCAPath"))
          );
          sslConfig = { sslValidate, sslCA: [sslCA] };
        }

        return {
          uri: connectionString,
          ...sslConfig,
        };
      },
      inject: [CONFIG],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
