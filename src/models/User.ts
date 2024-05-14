import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role";
import { Task } from "./Task";
import { Group } from "./Group";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({name: "first_name"})
    firstName!: string;

    @Column({name: "last_name"})
    lastName!: string;

    @Column({name: "email"})
    email!: string;

    @Column({name: "password", select: false})
    password!: string;


    @Column({name: "is_active"})
    isActive!: boolean;

    @Column({name: "role_id"})
    roleId!: number;

    //Relation: User {0..n}...{1} Role

    @ManyToOne(()=>Role,(role)=>role.users)
    @JoinColumn ({name:"role_id"})
    role!:Role;

    //Relation: User {1}...{0..n} Task

    @OneToMany(()=>Task,(task)=>task.user)
    tasks?: Task[];

    //Relation: User {0..n}...{0..n} Groups
    @ManyToMany(()=>Group, group => group.users)
    @JoinTable({
        name:"members",
        joinColumn:{
            name:"user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn:{
            name:"group_id",
            referencedColumnName: "id"
        }
    })
    members?: Group[]
}
