import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUpdateProductDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    price: number

    @IsOptional()
    image?: string
}