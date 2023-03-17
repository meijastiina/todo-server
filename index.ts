import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { Pool, QueryResult } from 'pg'
require('dotenv').config()


const app: Express = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = 3001

// // Get - Retrieve tasks from db
app.get('/', (req: Request, res: Response) => {
    const pool = openDb()

    pool.query('SELECT * FROM task', (error, result ) => {
        if ( error ) {
            res.status(500).json({error: 'test'})
        }
        res.status(200).json(result.rows)  
    })
})

// Post - Add a new task
app.post('/new', ( req: Request, res: Response ) => {
    const pool = openDb()

    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', 
    [req.body.description], 
    ( error: Error, result: QueryResult ) => {
        if ( error ) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json({id: result.rows[0].id })
    })
})

// Delete - Delete a task
app.delete('/delete/:id', async( req: Request, res: Response ) => {
    const pool = openDb()

    pool.query('DELETE FROM task WHERE id = $1', [req.params.id], ( error: Error, result: QueryResult ) => {
        if ( error ) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json({ id: req.params.id })
    })
});


const openDb = (): Pool => {
    const pool: Pool = new Pool({
        user: process.env.DATABASE_USERNAME,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: 5432,
        ssl: true
    })
    return pool
}
app.listen(port)