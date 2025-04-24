import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { AbstractService } from '../common/abstract.service'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Repository } from 'typeorm'
import Logging from '../../library/Logging'
import { compareHash, hash } from '../../utils/bcrypt'
import { PostgresErrorCode } from '../../helpers/postgresErrorCode.enum'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService extends AbstractService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
    super(usersRepository)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing email
    const existing = await this.findBy({ email: createUserDto.email })
    if (existing) {
      throw new BadRequestException('User with that email already exists.')
    }

    try {
      const hashedPassword = await hash(createUserDto.password)
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: { id: createUserDto.role_id },
      })
      return await this.usersRepository.save(newUser)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while creating user')
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id) as User;
    const { email, password, confirm_password, role_id, ...data } = dto;

    if (email && email !== user.email) {
      const conflict = await this.usersRepository.findOne({ where: { email } });
      if (conflict) {
        throw new BadRequestException('User with that email already exists.');
      }
      user.email = email;
    }

    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match');
      }
      if (await compareHash(password, user.password)) {
        throw new BadRequestException('New password cannot be the same as your old password.');
      }
      user.password = await hash(password);
    }

    if (role_id) {
      user.role = { ...user.role, id: role_id };
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        (user as any)[key] = value;
      }
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists.');
      }
      throw new InternalServerErrorException('Something went wrong while updating the user');
    }
  }


  async UpdateUserImageId(id: string, avatar: string): Promise<User> {
    const user = await this.findById(id)
    return this.update(user.id, { avatar })
  }
}