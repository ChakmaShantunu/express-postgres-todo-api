import { Router } from "express";
import { todoController } from "./todo.controller";
import { userController } from "../users/user.controller";

const router = Router();

router.post("/", todoController.createTodo);

router.get("/", todoController.getTodo);

router.get("/:id", todoController.getSingleTodo);

router.put("/:id", todoController.updateSingleTodo);

router.delete("/:id", todoController.deleteTodo);

export const todoRoutes = router;