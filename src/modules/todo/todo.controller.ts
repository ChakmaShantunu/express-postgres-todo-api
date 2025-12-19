import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {

    try {
        const result = await todoService.createTodo(req.body);

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
};

const getTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getTodo();

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
};

const getSingleTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getSingleTodo(req.params.id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Todo not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Todo retrived successfully",
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateSingleTodo = async (req: Request, res: Response) => {
    try {

        const result = await todoService.updateSingleTodo(req.params.id as string, req.body);

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
};

const deleteTodo = async (req: Request, res: Response) => {
    try {

        const result = await todoService.deleteTodo(req.params.id as string);

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
};

export const todoController = {
    createTodo,
    getTodo,
    getSingleTodo,
    updateSingleTodo,
    deleteTodo
}