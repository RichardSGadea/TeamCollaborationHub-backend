import express from "express"
import { userController } from "../controllers/userController";

const router = express.Router();

//Users routes
router.get('/profile', userController.getProfile)
router.put('/profile',userController.updateProfile)

export default router;
