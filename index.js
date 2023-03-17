"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const port = 3001;
// // Get - Retrieve tasks from db
app.get('/', (req, res) => {
    const pool = openDb();
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            res.status(500).json({ error: 'test' });
        }
        res.status(200).json(result.rows);
    });
});
// Post - Add a new task
app.post('/new', (req, res) => {
    const pool = openDb();
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [req.body.description], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: result.rows[0].id });
    });
});
// Delete - Delete a task
app.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = openDb();
    pool.query('DELETE FROM task WHERE id = $1', [req.params.id], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: req.params.id });
    });
}));
const openDb = () => {
    const pool = new pg_1.Pool({
        user: process.env.DATABASE_USERNAME,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
        ssl: process.env.NODE_ENV === 'production' ? true : false,
    });
    return pool;
};
app.listen(port);
