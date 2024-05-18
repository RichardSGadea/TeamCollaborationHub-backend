import express from "express"
import { userController } from "../controllers/userController";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

//Users routes
router.get('/profile',auth, userController.getProfile)
router.put('/profile',auth,userController.updateProfile)

//Protected routes
router.get('/students',auth,authorize(["admin","teacher"]),userController.getStudents)


export default router;
