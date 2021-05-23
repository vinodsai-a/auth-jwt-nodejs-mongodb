import { NestFactory } from "@nestjs/core";
import { IConfig } from "config";
import { AppModule } from "./app/app.module";
import { CONFIG } from "./config";
import { initializeSwagger } from "./swagger";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<IConfig>(CONFIG);
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.setGlobalPrefix(config.get("service.baseUrl"));
  initializeSwagger(app);
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
