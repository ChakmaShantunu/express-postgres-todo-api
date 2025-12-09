import express, { request, Request, Response } from "express";
import { Pool } from "pg"
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

app.post("/", (req: Request, res: Response) => {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "API is working"
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
