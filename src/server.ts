import express, { request, Request, Response } from "express";
import { Pool, Result } from "pg"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), '.env') });

const app = express()
const port = 5000;

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
});

// Parser
app.use(express.json());


const initDB = async () => {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        age INT,
        phone VARCHAR(15),
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        priority VARCHAR(20) DEFAULT 'normal',
        status VARCHAR(20) DEFAULT 'pending',
        is_deleted BOOLEAN DEFAULT false,
        category VARCHAR(50),
        due_date DATE,
        reminder_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        
        )
    `);
}

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Boss! Welcome to the server. Next level')
});

app.post("/users", async (req: Request, res: Response) => {

    const { name, email, password, role, age, phone, address } = req.body;

    try {

        const result = await pool.query(`INSERT INTO users(name, email, password, role, age, phone, address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING name, email, role, age`, [name, email, password, role, age, phone, address]);

        res.status(201).json({
            success: true,
            message: "User inserted successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

});

app.get("/users", async (req: Request, res: Response) => {
    try {

        const result = await pool.query(`SELECT id, name, email, role, age, phone, address, is_active FROM users`);

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result.rows
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

app.get("/users/:id", async (req: Request, res: Response) => {

    try {

        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id as string]);
        console.log(result.rows);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User retrived successfully",
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

app.put("/users/:id", async (req: Request, res: Response) => {

    const { name, email } = req.body;
    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING name, email`, [name, email, req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
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

app.delete("/users/:id", async (req: Request, res: Response) => {
    try {

        const result = await pool.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
