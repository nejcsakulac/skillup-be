import { IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator"
import { Match } from "../../../decorators/match.decorator"

export class CreateUserDto {
  @IsOptional()
  first_name?: string

  @IsOptional()
  last_name?: string

  @IsNotEmpty()
  @IsEmail()
  email: string
  // role_id: string

  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+='{};!?:".?()\[\]-]{6,}$/, {
    message: 'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  })
  password: string

  @IsNotEmpty()
  @Match(CreateUserDto, (field) => field.password, {message: 'Passwords do not match'})
  confirm_password: string
}