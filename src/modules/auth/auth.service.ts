import { pool } from "../../config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../config";

const registerUser = async (name: string, role: string, email: string, password: string) => {
    const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (existing.rows.length > 0) {
        return null
    }

    const hashpass = await bcrypt.hash(password as string, 10);
    console.log(hashpass);

    const result = await pool.query(`INSERT INTO users(name, role, email, password) VALUES($1, $2, $3, $4) RETURNING *`, [name, "user", email, hashpass]);

    const user = result.rows[0];

    return user

};

const loginUser = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if(result.rows.length === 0) {
        return null
    }

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        return false;
    }

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, config.jwtSecret as string, {
        expiresIn: "7d",
    });

    return {token, user}
}

export const authServices = {
    registerUser,
    loginUser
}