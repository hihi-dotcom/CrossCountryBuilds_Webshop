import { Router } from "express";
import { getCurrentUser, loginUser, logOutUser, signUp, deleteUserByEmail } from "./userController";
import {isAdmin} from "../middleware/authMiddleware";

const router = Router();
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/signup", signUp);

router.get("/user",getCurrentUser);

router.delete("/user", isAdmin,deleteUserByEmail);
export default router;