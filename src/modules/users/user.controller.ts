import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

    try {

        const result = await userService.createUser(req.body);

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

};

const getUser = async (req: Request, res: Response) => {
    try {

        const result = await userService.getUser();

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
};

const getSingleUser = async (req: Request, res: Response) => {

    try {

        const result = await userService.getSingleUser(req.params.id as string);

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
};

const updateSingleUser = async (req: Request, res: Response) => {

    try {
        const result = await userService.updateSingleUser(req.params.id as string, req.body);

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
};


export const userController = {
    createUser,
    getUser,
    getSingleUser,
    updateSingleUser
}