import { Request, Response } from "express";
import pool from "../../config/db";

// Create a receiving
export const createReceiving = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {} = req.body;
  } catch (error) {
    const err = error as Error;
    console.error("Error during get produce items", error);
    res.status(500).json({ error: err.message });
  }
};
