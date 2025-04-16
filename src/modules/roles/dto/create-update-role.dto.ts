import { IsNotEmpty } from 'class-validator'

export class CreateUpdateRoleDto{

  @IsNotEmpty()
  name: string


  @IsNotEmpty({message: 'There should be at least one permission selected'})
  permissions: string[]


}