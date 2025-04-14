import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import express from 'express'
import Logging from 'library/Logging'

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

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)

  Logging.log(`App is listnening on: ${await app.getUrl()}`)
}
bootstrap()
