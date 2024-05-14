import { TaskState } from "../models/TaskState";

export const TaskStates = {
    DO: {id:1,description:"To Do"} as TaskState,
    DOING: {id:2,description:"In Progress"} as TaskState,
    DONE: {id:3,description:"Done"} as TaskState,
};