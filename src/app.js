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

    const foundUser = result.rows[0]

    if(foundUser && bcrypt.compareSync(password, foundUser.password)){
        const session = await connection.query(`
            SELECT sessions.user_id, sessions.token, users.name
            FROM sessions
            JOIN users
            ON sessions.user_id = users.id
            WHERE sessions.user_id = $1
        `, [foundUser.id])

        const activeSession = session.rows[0]
        if(activeSession){

            return res.status(200).send({id: activeSession.user_id, name: activeSession.name, token: activeSession.token})
        }

        const token = uuidv4()
        await connection.query(`
            INSERT INTO sessions 
            (user_id, token)
            VALUES ($1, $2)
        `, [foundUser.id, token])
        

        const user = { id: foundUser.id, name: foundUser.name, token: token}
        res.status(200).send(user)
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
        res.sendStatus(500)
    }
})

let contador;
// all transactions route
app.get('/transactions', async (req, res) => {
    try {
        const authorization = req.header('Authorization')
        const token = authorization?.replace('Bearer ', '')

        if(!token) return res.sendStatus(401)

        const incomes = await connection.query(`
            SELECT transactions.value 
            FROM sessions
            JOIN users
            ON sessions.user_id = users.id
            JOIN transactions
            ON transactions.user_id = users.id
            WHERE sessions.token = $1 AND transactions.type = $2
        `, [token, "income"])
        const outflows = await connection.query(`
            SELECT transactions.value 
            FROM sessions
            JOIN users
            ON sessions.user_id = users.id
            JOIN transactions
            ON transactions.user_id = users.id
            WHERE sessions.token = $1 AND transactions.type = $2
        `, [token, "outflow"])
        const incomeTotal = incomes.rows.reduce((acc, cur) => acc + +cur.value, 0)
        const outflowTotal = outflows.rows.reduce((acc, cur) => acc + +cur.value, 0)
        const balanceTotal = incomeTotal - outflowTotal

        const result = await connection.query(`
            SELECT transactions.type, transactions.value, transactions.transaction_date, transactions.description
            FROM sessions
            JOIN users
            ON sessions.user_id = users.id
            JOIN transactions
            ON transactions.user_id = users.id
            WHERE sessions.token = $1
        `, [token])

        const transactions = result.rows

        if(transactions){
            res.status(200).send({transactions, balanceTotal})
            return
        } else{
            res.sendStatus(401)
        }
    } catch (error) {
        res.sendStatus(500)
    }
})
// newIncome route
app.post('/newIncome', async (req, res) => {
    try {
        const { value, description } = req.body
        const authorization = req.header('Authorization')
        const token = authorization?.replace('Bearer ', '')
        const newValue = value.replace(",", ".")
        const type = "income"

        if(!token) return res.sendStatus(401)

        const user = await connection.query(`
            SELECT *
            FROM sessions
            WHERE sessions.token = $1
        `, [token])
        const userId = user.rows[0].user_id
        const transaction_date = dayjs().format()
        await connection.query(`
            INSERT INTO transactions (type, value, user_id, transaction_date, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [type, newValue*100, userId, transaction_date, description])

        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
// newOutflow route
app.post('/newOutflow', async (req, res) => {
    try {
        const {value, description} = req.body
        const authorization = req.header('Authorization')
        const token = authorization?.replace('Bearer ', '')
        const newValue = value.replace(",", ".")
        const type = "outflow"

        if(!token) return res.sendStatus(401)

        const user = await connection.query(`
            SELECT *
            FROM sessions
            WHERE sessions.token = $1
        `, [token])
        
        const userId = user.rows[0].user_id
        const transaction_date = dayjs().format()
        await connection.query(`
            INSERT INTO transactions (type, value, user_id, transaction_date, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [type, newValue*100, userId, transaction_date, description])

        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
})

// END SESSION ROUTE
app.post('/logout', async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', '')
        if(!token) return res.sendStatus(401)

        await connection.query(`
            DELETE
            FROM sessions
            WHERE token = $1
        `, [token])
        res.sendStatus(200)   
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

export default app