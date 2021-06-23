import express from 'express'
import cors from 'cors'
import connection from './database.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

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
        const token = uuidv4()

        await connection.query(`
            INSERT INTO sessions 
            (user_id, token)
            VALUES ($1, $2)
        `, [user.id, token])
        res.sendStatus(200).send(token)
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

// newIncome route

// newOutflow route


app.listen(4000, () => {
    console.log("Server listening at port 4000")
})