import { Column, Entity, JoinColumn, JoinTable, ManyToMany } from 'typeorm'
import { Base } from './base.entity'
import { Permission } from './permission.entity'


@Entity()
export class Role extends Base {
  @Column()
  name: string

  //If we delete a row in ManyToMany table will delete all roles inside that table
  @ManyToMany(() => Permission, {cascade:true})
  @JoinTable({
    name: 'role_permission',
    joinColumn: {name: 'role_id', referencedColumnName: 'id'},
    inverseJoinColumn: {name: 'permission_id', referencedColumnName: 'id'},
  })
  permissions: Permission[]
}