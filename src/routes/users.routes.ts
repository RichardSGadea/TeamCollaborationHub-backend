import express from "express"
import { userController } from "../controllers/userController";
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

//Users routes
router.get('/profile',auth, userController.getProfile)
router.put('/profile',auth,userController.updateProfile)

//Protected routes
router.get('/allUsers/:id',auth,authorize(["admin"]),userController.getUserById)
router.put('/allUsers/:id',auth,authorize(["admin"]),userController.putUserById)
router.get('/students',auth,authorize(["admin","teacher"]),userController.getStudents)
router.get('/allUsers',auth,authorize(["admin"]),userController.getAllUsers)
router.post('/create',auth,authorize(["admin"]),userController.createUser)


export default router;
