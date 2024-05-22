import express from "express";
import userRoutes from "./users.routes"
import authRoutes from "./auth.routes";
import groupRoutes from "./groups.routes";


const router = express.Router();

//API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);


export default router;