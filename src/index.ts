import Database from "./database";
import { config } from "dotenv";
import "./server/index"

config();

export const db = new Database()
