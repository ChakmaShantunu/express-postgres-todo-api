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


app.get("/todos", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT id, user_id, title, completed, priority, status, due_date FROM todos`);

        res.status(200).json({
            success: true,
            message: "Todo retrieved successfully",
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
    const { title, completed } = req.body;
    try {

        const result = await pool.query(`UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING id, user_id, title, completed, priority, status, due_date`, [title, completed, req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Todo not found"
            })

        } else {
            res.status(200).json({
                success: true,
                message: "Todo updated successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
    try {

        const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [req.params.id]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Todos not found"
            })
        } else {
            res.status(201).json({
                success: true,
                message: "Todo deleted successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

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
