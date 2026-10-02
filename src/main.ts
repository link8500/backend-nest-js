import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Backend NestJS API")
    .setDescription(
      "API REST para la gestión de tenants y usuarios con NestJS, Prisma y PostgreSQL.",
    )
    .setVersion("1.0")
    .addTag("users", "Operaciones CRUD de usuarios")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API ejecutándose en http://localhost:${port}`);
  console.log(`Swagger disponible en http://localhost:${port}/api`);
}

void bootstrap();
