import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("ping")
  @ApiOperation({
    operationId: "ping",
    description: "Endpoint to test",
  })
  @ApiTags("health")
  getHello(): string {
    return this.appService.getHello();
  }
}
