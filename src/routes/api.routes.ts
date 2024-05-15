import express from "express";
import userRoutes from "./users.routes"
import authRoutes from "./auth.routes";

const router = express.Router();

//API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);


export default router;