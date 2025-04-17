
import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from 'entities/product.entity'
import { ProductsService } from './products.service'

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
