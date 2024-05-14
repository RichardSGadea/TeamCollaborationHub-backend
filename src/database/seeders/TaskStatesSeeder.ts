
import { TaskStates } from "../../constants/TaskStates";
import { TaskState } from "../../models/TaskState";
import { Seeder } from "./Seeder";

export class TaskStatesSeeder extends Seeder{
    protected async generate(): Promise<void> {
        const states : Partial<TaskState>[] = [
            TaskStates.DO,
            TaskStates.DOING,
            TaskStates.DONE,
        ];

        await TaskState.save(states)
    }
}