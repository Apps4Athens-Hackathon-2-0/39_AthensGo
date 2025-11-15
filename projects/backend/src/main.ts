import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import type { Request, Response } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("AthensGo API")
    .setDescription(
      "The API used to power the AthensGo app for the Apps4Athens Hackathon",
    )
    .setVersion("0.0.1")
    .addTag("ai")
    .addTag("auth")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use("/openapi", (_req: Request, res: Response) => {
    return res.json(document);
  });

  app.use(
    "/reference",
    apiReference({
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
