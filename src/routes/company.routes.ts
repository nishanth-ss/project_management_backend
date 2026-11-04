import { Router } from "express";
import { createCompanyController } from "../controllers/company.controller.js";

const router = Router();

router.post("/register", createCompanyController);

export default router;