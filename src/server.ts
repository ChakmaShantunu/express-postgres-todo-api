import express, { NextFunction, request, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";


const app = express()
const port = config.port || 5000;


// Parser
app.use(express.json());


initDB();



app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello Boss! Welcome to the server. Next level')
});

app.use("/users", userRoutes);

app.use("/todos", todoRoutes);



app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
