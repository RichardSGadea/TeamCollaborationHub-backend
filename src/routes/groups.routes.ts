import express from "express"
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { groupController } from "../controllers/groupController";
import { taskController } from "../controllers/taskController";

const router = express.Router();

//Groups routes
router.get('/',auth,groupController.getGroups)
router.get('/group/:id',auth,groupController.getGroupById)

//Protected routes
router.get('/allGroups',auth,authorize(["admin"]),groupController.getAllGroups)
router.post('/create',auth,authorize(["teacher"]),groupController.create)
router.put('/:id',auth,authorize(["teacher"]),groupController.update)
router.delete('/:id',auth,authorize(["teacher"]),groupController.delete)
router.post('/:id/users',auth,authorize(["teacher"]),groupController.addUserToGroup)
router.delete('/:id/users',auth,authorize(["teacher"]),groupController.deleteUserToGroup)
router.get('/:id/users',auth,authorize(["teacher"]),groupController.getUsersFromGroup)
router.get('/:id/outUsers',auth,authorize(["teacher"]),groupController.getStudentsOutOfGroup)

//Group tasks routes
router.post('/:id/tasks',auth,taskController.create)
router.get('/:id/tasks',auth,taskController.getTasks)
router.get('/:id/tasks/:task',auth,taskController.getTaskById)
router.put('/:id/tasks/:task',auth,taskController.modifyTask)
router.delete('/:id/tasks/:task',auth,taskController.deleteTask)



export default router;