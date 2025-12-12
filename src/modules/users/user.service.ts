import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {

    const { name, email, password, role, age, phone, address } = payload;
    
    const result = await pool.query(`INSERT INTO users(name, email, password, role, age, phone, address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING name, email, role, age`, [name, email, password, role, age, phone, address]);

    return result;
}


export const userService = {
    createUser
}