import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { UserRoles } from "../constants/UserRoles";

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

            if (!user){
                res.status(404).json({ message: "User not found"});
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

            const { yourPassword, newPassword, role, ...resUserData } = req.body

            const userToUpdate = await User.findOne({
                select: {
                    id: true,
                    password: true,
                },
                where: { id: userId },
            })

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
                select:{
                    id: true,
                    firstName: true,
                    email: true,
                },
                where:{
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
}