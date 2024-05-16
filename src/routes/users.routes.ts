import express from "express"
import { userController } from "../controllers/userController";
import { auth } from "../middlewares/auth";

const router = express.Router();

//Users routes
router.get('/profile',auth, userController.getProfile)
router.put('/profile',auth,userController.updateProfile)
router.get('/students',auth,userController.getStudents)

export default router;
