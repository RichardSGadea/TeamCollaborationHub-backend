import express from "express"
import { auth } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { groupController } from "../controllers/groupController";

const router = express.Router();

//Groups routes
router.post('/create',auth,authorize(["teacher"]),groupController.create)


export default router;