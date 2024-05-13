import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role";

@Entity("users")
export class User {

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
}
