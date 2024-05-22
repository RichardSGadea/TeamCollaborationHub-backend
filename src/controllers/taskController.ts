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

            if (typeof estimatedHours !== "number") {
                res.status(400).json({
                    
                    message: `Remember you must insert a number, try again`
                });
                return;
            }

            const createTask = await Task.create({
                name: name,
                description: description,
                estimatedHours: estimatedHours,
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

            res.json(groupToFind.tasks);
            
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve tasks info"
            });  
        }
    },


}