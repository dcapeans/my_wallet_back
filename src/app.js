import express from 'express'
import cors from 'cors'
import connection from './database.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'

const app = express()
app.use(express.json())
app.use(cors())

// sign-in route
app.post('/sign-in', async (req, res) => {
    try {
    const { email, password } = req.body
    const result = await connection.query(`
        SELECT * 
        FROM users
        WHERE email = $1    
    `, [email])

    const user = result.rows[0]

    if(user && bcrypt.compareSync(password, user.password)){
        const session = await connection.query(`
            SELECT *
            FROM sessions
            WHERE sessions.user_id = $1
        `, [user.id])

        const activeSession = session.rows[0]
        if(activeSession){
            return res.send(activeSession.token)
        }

        const token = uuidv4()
        await connection.query(`
            INSERT INTO sessions 
            (user_id, token)
            VALUES ($1, $2)
        `, [user.id, token])
        
        console.log(token)
        res.send(token)
    } else {
        res.sendStatus(401)
    }  
    } catch (error) {
        res.sendStatus(500)
    }
})

// sign-up route
app.post('/sign-up', async (req, res) =>{
    try {
    const { name, email, password } = req.body
    const passwordHash = bcrypt.hashSync(password, 10)
    
    const user = await connection.query(`
        SELECT * 
        FROM users
        WHERE email = $1
    `, [email])

    const userExists = user.rows[0]

    if(userExists){
        return res.sendStatus(409)
    }

    await connection.query(`
        INSERT INTO users 
        (name, email, password)
        VALUES ($1, $2, $3)
    `, [name, email, passwordHash])

    res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

// all transactions route
app.get('/transactions', async (req, res) => {
    try {
        const authorization = req.header('Authorization')
        const token = authorization?.replace('Bearer ', '')

        if(!token) return res.sendStatus(401)

        const result = await connection.query(`
            SELECT transactions.type, transactions.value, transactions.transaction_date
            FROM sessions
            JOIN users
            ON sessions.user_id = users.id
            JOIN transactions
            ON transactions.user_id = users.id
            WHERE sessions.token = $1
        `, [token])

        const transactions = result.rows

        if(transactions){
            res.send(transactions)
            return
        } else{
            res.sendStatus(401)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
// newIncome route
app.post('/newIncome', async (req, res) => {
    try {
        const { type, value } = req.body
        const authorization = req.header('Authorization')
        const token = authorization?.replace('Bearer ', '')

        if(type !== 'income') return res.sendStatus(400)
        if(!token) return res.sendStatus(401)

        const user = await connection.query(`
            SELECT *
            FROM sessions
            WHERE sessions.token = $1
        `, [token])

        const userId = user.rows[0].user_id
        const transaction_date = dayjs().format()
        await connection.query(`
            INSERT INTO transactions (type, value, user_id, transaction_date)
            VALUES ($1, $2, $3, $4)
        `, [type, value, userId, transaction_date])

        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
})
// newOutflow route
app.post('/newOutflow', async (req, res) => {
    try {
        const { type, value } = req.body
        const authorization = req.header('Authorization')
        const token = authorization?.replace('Bearer ', '')

        if(type !== 'outflow') return res.sendStatus(400)
        if(!token) return res.sendStatus(401)

        const user = await connection.query(`
            SELECT *
            FROM sessions
            WHERE sessions.token = $1
        `, [token])
        
        const userId = user.rows[0].user_id
        const transaction_date = dayjs().format()
        await connection.query(`
            INSERT INTO transactions (type, value, user_id, transaction_date)
            VALUES ($1, $2, $3, $4)
        `, [type, value, userId, transaction_date])

        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.listen(4000, () => {
    console.log("Server listening at port 4000")
})