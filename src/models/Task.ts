import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User";
import { TaskState } from "./TaskState";
import { Group } from "./Group";

@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({name: "name"})
    name!:string;

    @Column({name: "description"})
    description!:string;

    @Column({name: "estimated_hours"})
    estimatedHours!:number;

    @Column({name: "spent_hours"})
    spentHours!:number;

    @Column({name: "create_date"})
    createDate!:Date;

    @Column({name: "end_date"})
    endDate!:Date;

    @Column({name: "deadline"})
    deadline!:Date;

    @Column({name: "user_id"})
    userId!: number;

    @Column({name: "group_id"})
    groupId!: number;

    @Column({name: "state_id"})
    stateId!: number;

    //Relation: Task {0..n}...{1} User

    @ManyToOne(()=>User,(user)=>user.tasks)
    @JoinColumn ({name:"user_id"})
    user!:User;

    //Relation: Task {0..n}...{1} Group

    @ManyToOne(()=>Group,(group)=>group.tasks)
    @JoinColumn ({name:"group_id"})
    group!:Group;

    //Relation: Task {0..n}...{1} TaskState

    @ManyToOne(()=>TaskState,(taskState)=>taskState.tasks)
    @JoinColumn ({name:"state_id"})
    taskState!:TaskState;
}
