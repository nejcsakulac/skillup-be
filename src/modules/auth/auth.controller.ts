import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from 'decorators/public.decorator'
import { User } from 'entities/user.entity'
import { Response, Request } from 'express'
import { RegisterUserDto } from './dto/register-user.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { RequestWithUser } from 'interfaces/auth.interface'

const isProd = process.env.NODE_ENV === 'production'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
      @Req() req: RequestWithUser,
      @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    })
    return req.user
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async user(@Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token']
    return this.authService.user(cookie)
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(
      @Res({ passthrough: true }) res: Response,
  ): Promise<{ msg: string }> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    })
    return { msg: 'OK' }
  }
}
