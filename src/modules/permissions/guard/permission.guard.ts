import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from '../../auth/auth.service'
import { UsersService } from '../../users/users.service'
import { Reflector } from '@nestjs/core'
import { RolesService } from 'modules/roles/roles.service'
import { User } from '../../../entities/user.entity'
import { Role } from '../../../entities/role.entity'



@Injectable()
export class PermissionGuard implements CanActivate{
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private usersService: UsersService,
    private rolesService: RolesService,
  ){}

  async canActivate (context: ExecutionContext): Promise<boolean>{
    const access = this.reflector.get('access' , context.getHandler())
    if(!access){
      return true
    }

    const request = context.switchToHttp().getRequest()
    const userId = await this.authService.getUserId(request)
    const user: User = await this.usersService.findById(userId, ['role'])
    const role: Role = await this.rolesService.findById(user.role.id, ['permissions'])
    if(request.method === 'GET'){
      return role.permissions.some((p) => p.name === `view_${access}` || p.name === `edit_${access}`)
    }
    return role.permissions.some((p) => p.name === `edit_${access}`)
  }


}