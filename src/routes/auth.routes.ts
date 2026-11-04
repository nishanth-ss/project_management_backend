import { Router} from "express";
import { loginUserController } from "../controllers/auth.controller.js";
import { authenticationToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/me", authenticationToken,(req,res)=>{
    return res.status(200).json({
        message: "Authentication successfull",
        userId: req.user?.userId
    })
})
router.post("/login",loginUserController)

export default router;