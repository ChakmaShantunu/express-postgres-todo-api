import express, { NextFunction, request, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";


const app = express()
const port = config.port || 5000;


// Parser
app.use(express.json());


initDB();



app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello Boss! Welcome to the server. Next level')
});

app.use("/users", userRoutes);


app.post("/todos", async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    if (!user_id || !title) {
        return res.status(404).json({
            success: false,
            message: "user_id and title are required"
        })
    }

    try {
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING user_id, title`, [user_id, title]);

        res.status(201).json({
            success: true,
            message: "Todo inserted successfully",
            data: result.rows[0]
        })


    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

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
