import { Request, Response } from "express";
import { User } from "../models/User";
import { Group } from "../models/Group";



export const groupController = {

    async create(req: Request , res: Response): Promise<void> {
        try {

            const userId = Number(req.tokenData.userId);

            const { nameGroup } = req.body;
            
            if (!nameGroup) {
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

            const newGroup = Group.create({
                name: nameGroup,
                users: [user]
            }) 

            await Group.save(newGroup)

            res.status(201).json({
                message: "Group has been created",
            })

        } catch (error) {
            res.status(500).json({
                message: "Failed to create group"
            })
        }

    },

    


}