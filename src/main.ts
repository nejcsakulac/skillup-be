import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import express from 'express'
import Logging from 'library/Logging'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  app.use('/files', express.static('files'))

  // setup swagger
  const config = new DocumentBuilder()
      .setTitle("NestJS Tutorial API")
      .setDescription("This is API for NestJS tutorial")
      .setVersion("1.0.0")
      .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)

  Logging.log(`App is listnening on: ${await app.getUrl()}`)
}
bootstrap()