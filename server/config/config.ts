import dotenv from "dotenv";
import mysql from "mysql2";
import { jumpBackDirectory } from "../utils/helpers";

console.log("config", __filename);
dotenv.config({ path: jumpBackDirectory(__dirname, 1, ".env") });

const db = mysql.createConnection({
    user: "root",
    password: process.env.KAKERFL,
    database: "imagine",
    host: "localhost",
    
    namedPlaceholders: true,
});

const PORT = process.env.PORT || 3001;
export { db, PORT };
