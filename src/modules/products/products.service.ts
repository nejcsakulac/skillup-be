import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'entities/product.entity'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'
import { CreateUpdateProductDto } from './dto/create-update-product.dto'
import Logging from 'library/Logging'

@Injectable()
export class ProductsService extends AbstractService {
    constructor(@InjectRepository(Product) private readonly productsRepository: Repository<Product>) {
        super(productsRepository)
    }

    async create(createProductDto: CreateUpdateProductDto): Promise<Product> {
        try {
            const product = this.productsRepository.create(createProductDto)
            return this.productsRepository.save(product)
        } catch (error) {
            Logging.error(error)
            throw new BadRequestException('Something went wrong while creating a new product. ')
        }
    }

    async update(productId: string, updateProductDto: CreateUpdateProductDto): Promise<Product> {
        const product = (await this.findById(productId)) as Product
        try {
            product.title = updateProductDto.title
            product.description = updateProductDto.description
            product.price = updateProductDto.price
            product.image = updateProductDto.image
            return this.productsRepository.save(product)
        } catch (error) {
            Logging.error(error)
            throw new InternalServerErrorException('Something went wront while updating the product. ')
        }
    }

    async updateProductImage(id: string, image: string): Promise<Product> {
        const product = await this.findById(id)
        return this.update(product.id, { ...product, image })
    }
}