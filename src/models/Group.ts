import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Task } from "./Task";
import { User } from "./User";

@Entity("groups")
export class Group {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({name: "name"})
    name!:string;

    //Relation: Group {1}...{0..n} Task

    @OneToMany(()=>Task,(task)=>task.group)
    tasks?: Task[];

    //Relation: User {0..n}...{0..n} Groups
    @ManyToMany(()=>User, user => user.members)
    users?: User[]
}
