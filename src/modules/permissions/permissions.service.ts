import { BadRequestException, Body, Injectable } from '@nestjs/common'
import { AbstractService } from '../common/abstract.service'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Repository } from 'typeorm'
import { Permission } from '../../entities/permission.entity'
import { CreatePermissionDto } from './dto/create-permission.dto'
import Logging from '../../library/Logging'

@Injectable()
export class PermissionsService extends AbstractService{
  constructor(@InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>) {
    super(permissionsRepository)
  }

  async create(createPermissionsDto: CreatePermissionDto): Promise<Permission>{
    try {
      const permission = this.permissionsRepository.create(createPermissionsDto)
      return this.permissionsRepository.save(permission)
    }catch (error){
      Logging.error(error)
      throw new BadRequestException('Something went wrong while creating a new permission. ')
    }
  }

}
