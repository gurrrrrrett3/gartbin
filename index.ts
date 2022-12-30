import Database from "./database";
import Puppet from "./server/puppet";
import { config } from "dotenv";
import "./server"

config();

export const db = new Database()
export const puppet = new Puppet()
