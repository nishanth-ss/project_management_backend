import express from "express";
import userRoutes from "./routes/user.routes.js";
import workspaceRoutes from "./routes/workspace.route.js";
import companyRoutes from "./routes/company.routes.js";
import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/member.route.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.route.js";
import commentRoutes from "./routes/comment.route.js";
import activityLogsRoutes from "./routes/activitylog.router.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    console.log("test")
    res.json({message: "Project management api is running!"})
});

app.use("/users",userRoutes)
app.use("/workspace",workspaceRoutes)
app.use("/workspaces",memberRoutes)
app.use("/company",companyRoutes)
app.use("/auth",authRoutes)
app.use("/projects",projectRoutes)
app.use("/tasks",taskRoutes)
app.use("/workspaces",commentRoutes)
app.use("/workspaces",activityLogsRoutes)
app.use("/workspaces",notificationRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`);
});