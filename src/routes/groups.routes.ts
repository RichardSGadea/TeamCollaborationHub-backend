import express from "express"
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { groupController } from "../controllers/groupController";

const router = express.Router();

//Groups routes
router.get('/',auth,groupController.getGroups)
router.get('/:id',auth,groupController.getGroupById)

//Protected routes
router.post('/create',auth,authorize(["teacher"]),groupController.create)
router.post('/:id/users',auth,authorize(["teacher"]),groupController.addUserToGroup)


export default router;