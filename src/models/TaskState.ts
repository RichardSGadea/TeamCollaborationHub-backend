import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Task } from "./Task";

@Entity("taskStates")
export class TaskState extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({name: "description"})
    description!:string;

    //Relation: TaskState {1}...{0..n} Task

    @OneToMany(()=>Task,(task)=>task.taskState)
    tasks?: Task[];
}
