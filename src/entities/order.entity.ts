import { Exclude, Expose } from 'class-transformer'
import { Column, Entity, OneToMany } from 'typeorm'
import { Base } from './base.entity'
import { OrderItem } from './order-item.entity'
@Entity()
export class Order extends Base {
    @Column()
    @Exclude()
    first_name: string

    @Column()
    @Exclude()
    last_name: string

    @Column()
    email: string

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    order_items: OrderItem[]

    @Expose()
    get name(): string {
        return `${this.first_name} ${this.last_name}`
    }

    @Expose()
    get total(): number {
        return this.order_items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    }
}