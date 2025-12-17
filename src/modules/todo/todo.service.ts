import { pool } from "../../config/db";

const createTodo = async (payload: Record<string, unknown>) => {
    const { user_id, title } = payload;
    const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING user_id, title`, [user_id, title]);
    return result
};

const getTodo = async () => {
    const result = await pool.query(`SELECT id, user_id, title, completed, priority, status, due_date FROM todos`);
    return result;
};

const getSingleTodo = async (id: string) => {
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
    return result;
};

const updateSingleTodo = async (id: string, payload: Record<string, unknown>) => {
    const { completed } = payload;
    const result = await pool.query(`UPDATE todos SET completed=$1 WHERE id=$2 RETURNING completed`, [completed, id]);
    return result;
};

export const todoService = {
    createTodo,
    getTodo,
    getSingleTodo,
    updateSingleTodo
}