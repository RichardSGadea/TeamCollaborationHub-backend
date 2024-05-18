import { Request, Response } from "express";
import { User } from "../models/User";
import { Group } from "../models/Group";
import { Task } from "../models/Task";
import { UserRoles } from "../constants/UserRoles";


export const groupController = {

    async create(req: Request, res: Response): Promise<void> {
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

    async getGroups(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.tokenData.userId);

            const user = await User.findOne({
                relations: ['members'],
                where: {
                    id: userId
                },

            })

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({ groups: user.members });



        } catch (error) {
            console.error("Error fetching groups:", error);
            res.status(500).json({ message: "Failed to fetch groups" });
        }
    },

    async getGroupById(req: Request, res: Response): Promise<void> {
        try {
            const groupId = Number(req.params.id);


            const groupToShow = await Group.findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    users: true,
                    tasks: true
                },
            });

            if (!groupToShow) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            res.json(groupToShow);
        } catch (error) {
            console.error("Error querying the database:", error);
            res.status(500).json({
                message: "Failed to retrieve group info"
            });
        }
    },

    async addUserToGroup (req:Request,res:Response):Promise<void> {
        try {
            const userId = Number(req.body.userId); //User id
            const groupId = Number(req.params.id); // Group id

            // User exist?
            const user = await User.findOne({
                where: { id: userId }
            });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Group exist?
            const group = await Group.findOne({
                where: { id: groupId },
                relations: ["users"]
            });

            if (!group) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            // User is in group?
            const isUserInGroup = group.users?.some(groupUser => groupUser.id === userId);
            if (isUserInGroup) {
                res.status(400).json({ message: "User is already in the group" });
                return;
            }

            // Add user to group
            group.users?.push(user);
            await group.save();

            res.status(200).json({
                message: "User added to the group",
                group
            });
        } catch (error) {
            console.error("Error adding user to group:", error);
            res.status(500).json({
                message: "Failed to add user to group"
            });
        }

    },

    async getStudentsOutOfGroup (req:Request,res:Response): Promise <void> {
        try {
            const groupId = Number(req.params.id);

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 5;

            const [students, totalStudents] = await User.findAndCount({
                select:{
                    id: true,
                    firstName: true,
                    lastName:true,
                    email: true,
                    roleId: true
                },
                where:{
                    role: UserRoles.STUDENT,
                },
                relations:{
                    members:true
                },
                skip: (page - 1) * limit,
                take: limit

            })

            if (totalStudents === 0) {
                res.status(404).json({ message: "Students not found" });
                return;
            }

            //Filter users that no exist in group
            const studentsOutOfGroup = students.filter(student => !student.members?.some(group => group.id === groupId))

            if (studentsOutOfGroup.length === 0) {
                res.status(404).json({ message: "No students outside the group found" });
                return;
            }

            const totalPages = Math.ceil(totalStudents / limit);

            res.status(200).json({
                studentsOutOfGroup: studentsOutOfGroup,
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
            });
            
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve users"
            });
        }
    }








}