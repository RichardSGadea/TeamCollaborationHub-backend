import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { UserRoles } from "../constants/UserRoles";
import { json } from "stream/consumers";
import { log } from "console";

export const userController = {
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.tokenData.userId);

            const user = await User.findOne({
                relations: {
                    role: true,
                },
                where: {
                    id: userId
                },
            });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }

            res.json(user)

        } catch (error) {
            res.status(500).json({
                message: "Failed to get user profile"
            })
        }
    },

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.tokenData.userId);

            const { yourPassword, newPassword, role,email, ...resUserData } = req.body

            const userToUpdate = await User.findOne({
                select: {
                    id: true,
                    password: true,
                },
                where: { id: userId },
            })

            const emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i


            if (!emailRegex.test(email)) {
                res.status(400).json({
                    message: "Invalid email"
                })
                return
            }


            if (yourPassword) {
                const isPasswordCorrect = bcrypt.compareSync(yourPassword, userToUpdate!.password);
                if (!isPasswordCorrect) {
                    res.status(400).json({
                        message: "Repeat your password"
                    })
                    return;
                }
            }

            if (newPassword) {
                if (newPassword.length < 8 || (!newPassword.match(/[a-z]/) && !newPassword.match(/[A-Z]/)) || !newPassword.match(/\d/)) {
                    res.status(400).json({
                        message: "Invalid new password"
                    })
                    return;
                }
                const hashedPassword = bcrypt.hashSync(newPassword, 10);
                userToUpdate!.password = hashedPassword
            }

            const updatedUser: Partial<User> = {
                ...userToUpdate,
                ...resUserData,
            };

            await User.save(updatedUser);

            res.status(202).json({
                message: "User profile updated successfully"
            })

        } catch (error) {
            res.status(500).json({
                message: "Failed to update user profile"
            })
        }
    },

    async getStudents(req: Request, res: Response): Promise<void> {
        try {

            const [students, totalStudents] = await User.findAndCount({
                select: {
                    id: true,
                    firstName: true,
                    email: true,
                },
                where: {
                    role: UserRoles.STUDENT
                }
            })

            if (totalStudents === 0) {
                res.status(404).json({ message: "Students not found" });
                return;
            }

            res.status(200).json({
                students: students,
            });


        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve students"
            })
        }
    },

    async getAllUsers(req: Request, res: Response): Promise<void> {

        try {
            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 10;

            const [users, totalUsers] = await User.findAndCount({
                relations: {
                    role: true
                },
                skip: (page - 1) * limit,
                take: limit
            })

            if (!users) {
                res.status(404).json({ message: "Users not found" });
                return;
            }

            const totalPages = Math.ceil(totalUsers / limit);

            res.status(200).json({
                users: users,
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_users: totalUsers,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve users",
            });
        }
    },

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id)

            const userToShow = await User.findOne({
                relations: {
                    role: true
                },
                select: {
                    roleId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    id: true,
                    isActive: true
                },
                where: {
                    id: userId,
                }
            })

            if (!userToShow) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json(userToShow)

        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve user"
            })
        }
    },
    async putUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id)

            const { password, role,email, ...resUserData } = req.body

            const userToUpdate = await User.findOne({
                select: {
                    id: true,
                    password: true,
                },
                where: { id: userId },
            })

            const emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i


            if (!emailRegex.test(email)) {
                res.status(400).json({
                    message: "Invalid email"
                })
                return
            }

            if (password) {
                const hashedPassword = bcrypt.hashSync(password, 10);
                userToUpdate!.password = hashedPassword
            }

            const updatedUser: Partial<User> = {
                ...userToUpdate,
                ...resUserData,
            };

            await User.save(updatedUser);

            res.status(202).json({
                message: "User profile updated successfully"
            })

        } catch (error) {
            res.status(500).json({
                message: "Failed to update user"
            })
        }
    },

    async createUser (req:Request, res:Response): Promise <void>{

        try {

            const {firstName, lastName,email} = req.body 

            if(!firstName || !lastName || !email){
                res.status(400).json({
                    message:"All fields must be provided"
                })
                return;
            }

            const emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i

            if (!emailRegex.test(email)) {
                res.status(400).json({
                    message: "Invalid email"
                })
                return;
            }

            const users = await User.find();
            for (let element of users) {
                if (element.email === email) {
                    res.status(400).json({
                        message: "Email is already in use",
                    });
                    return;
                }
            };

            const hashedPassword = bcrypt.hashSync("12345678", 10);

            const userToCreate = User.create({
                firstName: firstName,
                lastName:lastName,
                email: email,
                password: hashedPassword,
                role: UserRoles.TEACHER
            });

            await User.save(userToCreate);

            res.status(201).json({
                message: "Teacher has been created"
            });


        } catch (error) {
            res.status(500).json({
                message: "Failed to create teacher",
            })
        }

    },
}