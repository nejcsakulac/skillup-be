import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from 'entities/user.entity'
import { Strategy } from 'passport-local'
import { AuthService } from 'modules/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authService.validateUser(email, password)
  }
}