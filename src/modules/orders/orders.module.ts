import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderItem } from 'entities/order-item.entity'
import { Order } from 'entities/order.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}