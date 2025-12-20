import { Request, Response } from "express";
import { pool } from "../../config/db";
import { authServices } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
    const { name, role, email, password } = req.body;
    try {
        const result = await authServices.registerUser(name, role, email, password)
        if (result === null) {
            res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: result
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const authController = {
    registerUser
}