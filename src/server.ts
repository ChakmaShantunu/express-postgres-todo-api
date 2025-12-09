import express, { request, Request, Response } from "express";
import { Pool } from "pg"

const app = express()
const port = 5000;

const pool = new Pool({
    connectionString: `postgresql://neondb_owner:npg_oW0eSZPaV8UM@ep-soft-mud-a4ehym3k-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
});

// Parser
app.use(express.json());


const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(20) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `)
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
