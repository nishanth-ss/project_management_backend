import { Router } from "express";
import { createUserController, deleteUserController, getUsersController, updateUserController } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsersController);
router.post("/create", createUserController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;