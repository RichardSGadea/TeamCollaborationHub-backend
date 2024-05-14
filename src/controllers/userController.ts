import { Request, Response } from "express";

export const userController = {
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const msg = "get Profile"
            res.json({message: msg})
        } catch (error) {
            
        }
    },
    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const msg = "put Profile"
            res.json({message: msg})
        } catch (error) {
            
        }
    },
}