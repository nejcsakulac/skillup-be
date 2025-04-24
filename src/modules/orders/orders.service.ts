import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from 'entities/order.entity'
import { Parser } from 'json2csv'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'
import { Response } from 'express'

@Injectable()
export class OrdersService extends AbstractService {
    constructor(@InjectRepository(Order) private readonly ordersRepository: Repository<Order>) {
        super(ordersRepository)
    }
    async export(response: Response): Promise<any> {
        const parser = new Parser({
            fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
        })

        const json = []

        const orders: Order[] = await this.findAll(['order_items'])
        orders.forEach((o) => {
            json.push({
                ID: o.id,
                Name: o.name,
                Email: o.email,
                'Product Title': '',
                Price: '',
                Quantity: '',
            })

            o.order_items.forEach((ot) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product Title': ot.product_title,
                    Price: ot.price,
                    Quantity: ot.quantity,
                })
            })
        })

        const csv = parser.parse(json)
        response.setHeader('Content-type', 'text/csv')
        response.attachment('orders.csv')
        response.send(csv)
    }
    async chart(): Promise<{ date: string; sum: string }[]> {
        const raw: Array<{ date: Date; total_revenue: string }> =
            await this.ordersRepository.query(`
                SELECT
                    CAST(o.created_at AS date)   AS date,
        SUM(oi.price * oi.quantity)  AS total_revenue
                FROM "order" o
                    JOIN "order_item" oi ON o.id = oi.order_id
                GROUP BY date
                ORDER BY date;
            `);

        return raw.map(r => ({
            date: r.date.toISOString().split('T')[0],
            sum: r.total_revenue,
        }));
    }
}