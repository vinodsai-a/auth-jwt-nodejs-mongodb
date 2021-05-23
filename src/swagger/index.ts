import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { IConfig } from "config";
import { CONFIG } from "../config/config.provider";

export const JWT_AUTH = "JWT-AUTH";
export const initializeSwagger = (app: INestApplication) => {
  const config = app.get<IConfig>(CONFIG);
  const serviceName = config.get<string>("service.name");
  const serviceDescription = config.get<string>("service.description");
  const apiVersion = config.get<string>("service.apiVersion");
  const docsBaseUrl = config.get<string>("service.docsBaseUrl");

  const options = new DocumentBuilder()
    .setTitle(`${serviceName} API spec`)
    .setDescription(serviceDescription)
    .setVersion(apiVersion)
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT token",
      in: "header",
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsBaseUrl, app, document, {
    swaggerOptions: {
      displayOperationId: true,
    },
  });
};
