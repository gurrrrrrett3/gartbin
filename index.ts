import Database from "./database";
import { config } from "dotenv";
import "./server"

config();

export const db = new Database()