import { Request, Response } from "express";
import { User } from "../models/User";
import { Task } from "../models/Task";
import { Group } from "../models/Group";


export const taskController = {

    async create(req: Request, res: Response): Promise<void> {

        try {

            const userId = Number(req.tokenData.userId);
            const groupId = Number(req.params.id);

            const {name, description, estimatedHours, deadline} = req.body;

            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const day = today.getDate() + 1;
            const todayDate = new Date(year, month - 1, day);

            const limitDate = new Date(deadline);

            if (!name || !description || !estimatedHours || !deadline) {
                res.status(400).json({
                    message: "All fields must be provided"
                })
                return;
            }

            const user = await User.findOne({
                where: {
                    id: userId,
                }
            })

            if (!user) {
                res.status(404).json({ message: "Restart Login, invalid token provided" });
                return;
            }

            const groupToFind = await Group.findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    users: true,
                    tasks: true
                },
            });

            if (!groupToFind) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            // User is in group?
            const isUserInGroup = groupToFind.users?.some(groupUser => groupUser.id === userId);
            if (!isUserInGroup) {
                res.status(400).json({ message: "You don't belong as a user in this group" });
                return;
            }

            if (limitDate < todayDate) {
                res.status(400).json({
                    message: 'This day is prior to the current day, try again.'
                });
                return;
            }

            const estimated_hours= Number(estimatedHours)

            if (Number.isNaN(estimated_hours)) {
                res.status(400).json({
                    
                    message: `Remember you must insert a number, try again`
                });
                return;
            }

            const createTask = await Task.create({
                name: name,
                description: description,
                estimatedHours: estimated_hours,
                deadline:deadline,
                userId: userId,
                groupId: groupId
            }).save()

            res.status(201).json({
                message: "Task has been created"
            })
            
        } catch (error) {
            res.status(500).json({
                message: "Failed to create task"
            })
        }
    
    },

    async getTasks(req: Request, res: Response): Promise<void> {

        try {

            const userId = Number(req.tokenData.userId);
            const groupId = Number(req.params.id);


            const user = await User.findOne({
                where: {
                    id: userId,
                }
            })

            if (!user) {
                res.status(404).json({ message: "Restart Login, invalid token provided" });
                return;
            }

            const groupToFind = await Group.findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    users: true,
                    tasks: true
                },
            });

            if (!groupToFind) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            // User is in group?
            const isUserInGroup = groupToFind.users?.some(groupUser => groupUser.id === userId);
            if (!isUserInGroup) {
                res.status(400).json({ message: "You don't belong as a user in this group" });
                return;
            }

            const [tasksToShow,totalTasks] = await Task.findAndCount({
                where:{
                    groupId:groupId,
                },
                relations:{
                    taskState:true
                }
            })

            res.json(tasksToShow);
            
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve tasks info"
            });  
        }
    },

    async getTaskById(req: Request, res: Response): Promise<void> {

        try {

            const userId = Number(req.tokenData.userId);
            const groupId = Number(req.params.id);
            const taskId = Number(req.params.task);

            const user = await User.findOne({
                where: {
                    id: userId,
                }
            })

            if (!user) {
                res.status(404).json({ message: "Restart Login, invalid token provided" });
                return;
            }

            const groupToFind = await Group.findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    users: true,
                    tasks: true
                },
            });

            if (!groupToFind) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            // User is in group?
            const isUserInGroup = groupToFind.users?.some(groupUser => groupUser.id === userId);
            if (!isUserInGroup) {
                res.status(400).json({ message: "You don't belong as a user in this group" });
                return;
            }

            const [tasksToShow] = await Task.find({
                where:{
                    groupId:groupId,
                    id:taskId,
                },
                relations:{
                    taskState:true
                }
            })

            res.json(tasksToShow);
            
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve task info"
            });  
        }
    },

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {


            
        } catch (error) {
            
        }

    },

    async modifyTask(req: Request, res: Response): Promise<void> {
        try {

            const userId = Number(req.tokenData.userId);
            const groupId = Number(req.params.id);
            const taskId = Number(req.params.task);

            const {spentHours,stateId,...resTaskData} = req.body

            const user = await User.findOne({
                where: {
                    id: userId,
                }
            })

            if (!user) {
                res.status(404).json({ message: "Restart Login, invalid token provided" });
                return;
            }

            const groupToFind = await Group.findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    users: true,
                    tasks: true
                },
            });

            if (!groupToFind) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            // User is in group?
            const isUserInGroup = groupToFind.users?.some(groupUser => groupUser.id === userId);
            if (!isUserInGroup) {
                res.status(400).json({ message: "You don't belong as a user in this group" });
                return;
            }

            const taskToUpdate = await Task.findOne({
                select:{
                    id:true
                },
                where:{
                    groupId:groupId,
                    id:taskId,
                }
            })
            
            const spent_hours= Number(spentHours)
            const state_id= Number(stateId)

            if (Number.isNaN(spent_hours) || Number.isNaN(state_id)) {
                res.status(400).json({
                    
                    message: `Remember you must insert a number, try again`
                });
                return;
            }

            taskToUpdate!.spentHours = spent_hours
            taskToUpdate!.stateId = state_id
            

            const updatedTask: Partial<Task> = {
                ...taskToUpdate,
                ...resTaskData,
            };

            await Task.save(updatedTask);

            res.status(202).json({
                message: "Task updated successfully",
                task:updatedTask
            })
            
        } catch (error) {
            res.status(500).json({
                message: "Failed to update task"
            });  
        }

    },


}