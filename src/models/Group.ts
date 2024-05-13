import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Task } from "./Task";

@Entity("groups")
export class Group {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({name: "name"})
    name!:string;

    //Relation: Group {1}...{0..n} Task

    @OneToMany(()=>Task,(task)=>task.group)
    tasks?: Task[];
}
