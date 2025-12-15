import { Router } from "express";
import { todoController } from "./todo.controller";

const router = Router();

router.post("/", todoController.createTodo)

export const todoRoutes = router;