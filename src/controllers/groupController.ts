import { Request, Response } from "express";
import { User } from "../models/User";
import { Group } from "../models/Group";
import { UserRoles } from "../constants/UserRoles";
import { Task } from "../models/Task";


export const groupController = {

    async create(req: Request, res: Response): Promise<void> {
        try {

            const userId = Number(req.tokenData.userId);

            const { nameGroup } = req.body;

            if (!nameGroup) {
                res.status(400).json({
                    message: "Insert group name. Try again."
                })
                return;
            }

            if (nameGroup === "") {
                res.status(400).json({
                    message: "The name field shouldn't be empty"
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
    async update(req: Request, res: Response): Promise<void> {
        try {

            const userId = Number(req.tokenData.userId);
            const { nameGroup } = req.body;

            const user = await User.findOne({
                where: {
                    id: userId,
                }
            })

            if (!user) {
                res.status(404).json({ message: "Restart Login, invalid token provided" });
                return;
            }

            const groupId = Number(req.params.id);

            const groupToUpdate = await Group.findOne({
                where: {
                    id: groupId,

                },
            });

            if (!groupToUpdate) {
                res.status(404).json({
                    message: "Group not found"
                })
                return;
            }

            if (!nameGroup) {
                res.status(400).json({
                    message: "All fields must be provided, insert group name"
                })
                return;
            }

            if (nameGroup === "") {
                res.status(400).json({
                    message: "The name field shouldn't be empty"
                })
                return;
            }

            groupToUpdate.name = nameGroup;

            await Group.save(groupToUpdate)

            res.status(201).json({
                message: "Group has been updated"
            })

        } catch (error) {
            res.status(500).json({
                message: "Failed to update group"
            })
        }

    },

    async delete(req: Request, res: Response): Promise<void> {

        try {

            const groupId = Number(req.params.id);

            const groupToDelete = await Group.findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    tasks: true,
                    users: true,
                }
            });

            if (!groupToDelete) {
                res.status(404).json({
                    message: "Group not found"
                })
                return;
            }

            const tasksFromGroup = await Task.find({ where: { groupId: groupId } })

            for (let element of tasksFromGroup) {
                await Task.delete(element.id)
            }

            if (groupToDelete.users) {
                for (const user of groupToDelete.users) {
                    await User.createQueryBuilder()
                        .relation(User, "members")
                        .of(user.id)
                        .remove(groupToDelete.id);
                }
            }

            await Group.delete(groupId);

            res.status(200).json({ message: "Group deleted successfully" });

        } catch (error) {
            res.status(500).json({
                error: error,
                message: "Failed to delete group"
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
            const userId = Number(req.tokenData.userId);
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

            // User is in group?
            const isUserInGroup = groupToShow.users?.some(groupUser => groupUser.id === userId);
            if (!isUserInGroup) {
                res.status(400).json({ message: "You don't belong as a user in this group" });
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

    async addUserToGroup(req: Request, res: Response): Promise<void> {
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

    async getUsersFromGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = Number(req.params.id);

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 5;

            const [users, totalUsers] = await User.findAndCount({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    roleId: true
                },
                relations: {
                    members: true
                },


            })

            if (totalUsers === 0) {
                res.status(404).json({ message: "Students not found" });
                return;
            }

            //Filter users that no exist in group
            const studentsFromGroup = users.filter(user => user.members?.some(group => group.id === groupId))

            if (studentsFromGroup.length === 0) {
                res.status(404).json({ message: "No students from group found" });
                return;
            }

            //Apply pagination of data filtered
            const totalStudentsFromGroup = studentsFromGroup.length;
            const totalPages = Math.ceil(totalStudentsFromGroup / limit);
            const paginatedStudents = studentsFromGroup.slice((page - 1) * limit, page * limit);

            res.status(200).json({
                studentsFromGroup: paginatedStudents,
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_students: totalStudentsFromGroup,
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve users"
            });
        }
    },

    async getStudentsOutOfGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = Number(req.params.id);

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 5;

            const [students, totalStudents] = await User.findAndCount({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    roleId: true
                },
                where: {
                    role: UserRoles.STUDENT,
                },
                relations: {
                    members: true
                },
                order: {
                    lastName: "ASC"
                }

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

            //Apply pagination of data filtered
            const totalStudentsOutOfGroup = studentsOutOfGroup.length;
            const totalPages = Math.ceil(totalStudentsOutOfGroup / limit);
            const paginatedStudents = studentsOutOfGroup.slice((page - 1) * limit, page * limit);

            res.status(200).json({
                studentsOutOfGroup: paginatedStudents,
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_students: totalStudentsOutOfGroup,
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve users"
            });
        }
    },
    async deleteUserToGroup(req: Request, res: Response): Promise<void> {
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

            // ¿user in group?
            const userIndex = group.users?.findIndex(u => u.id === userId);

            if (userIndex === -1 || userIndex === undefined) {
                res.status(404).json({ message: "User is not in the group" });
                return;
            }

            // Delete user to group
            group.users?.splice(userIndex, 1);;
            await group.save();

            res.status(200).json({
                message: "User deleted to the group",
                group
            });
        } catch (error) {
            console.error("Error deleting user from group:", error);
            res.status(500).json({
                message: "Failed to delete user from group"
            });
        }
    },

    async getAllGroups(req:Request,res:Response): Promise <void> {
        try {

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 10;

            const [groups,totalGroups] = await Group.findAndCount({
                relations:{
                    users:true,
                    tasks:true,
                },
                skip: (page - 1) * limit,
                take: limit
            })

            if (!groups) {
                res.status(404).json({ message: "Groups not found" });
                return;
            }

            const totalPages = Math.ceil(totalGroups / limit);

            res.status(200).json({
                groups: groups,
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_users:totalGroups,
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve groups",
            });
        }
    },

    async getOneGroupById (req:Request, res:Response): Promise <void> {
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
            res.status(500).json({
                message: "Failed to retrieve group info"
            });
        }
    },

}