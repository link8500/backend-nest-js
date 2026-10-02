import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: "Backend NestJS API",
      status: "ok",
      docs: "/api",
    };
  }
}
