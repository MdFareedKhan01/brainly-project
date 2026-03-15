import dotenv from "dotenv";
dotenv.config();

export const connectionString = process.env.MONGO_URI as string;
export const JWT_PASSWORD = process.env.JWT_SECRET as string;