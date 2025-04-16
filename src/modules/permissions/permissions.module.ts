import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { Permission } from '../../entities/permission.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission])
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService]
})
export class PermissionsModule {}
