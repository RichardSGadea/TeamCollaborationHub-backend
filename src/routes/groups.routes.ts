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
router.put('/:id',auth,authorize(["teacher"]),groupController.update)
router.post('/:id/users',auth,authorize(["teacher"]),groupController.addUserToGroup)
router.delete('/:id/users',auth,authorize(["teacher"]),groupController.deleteUserToGroup)
router.get('/:id/users',auth,authorize(["teacher"]),groupController.getUsersFromGroup)
router.get('/:id/outUsers',auth,authorize(["teacher"]),groupController.getStudentsOutOfGroup)


export default router;