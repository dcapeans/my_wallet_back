import supertest from 'supertest'
import app from '../src/app.js'
import connection from '../src/database.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

beforeAll(async () => {
    await connection.query(`
        DELETE
        FROM users
    `)
    await connection.query(`
        DELETE
        FROM sessions
    `)
})

afterAll(() => {
    connection.end()
})


describe("POST /sign-up", () => {
    it("returns status 201 for success", async () => {
        const credentials = {name: "Teste", email: "teste@teste.com", password: "123456"}
        const result = await supertest(app).post("/sign-up").send(credentials)
        expect(result.status).toEqual(201)
    })
    it("returns status 409 if user already exists", async () => {
        const credentials = {name: "Teste", email: "teste@teste.com", password: "123456"}
        const passwordHash = bcrypt.hashSync(credentials.password, 10)

        await connection.query(`
            INSERT INTO users 
            (name, email, password)
            VALUES ($1, $2, $3)
        `, [credentials.name, credentials.email, passwordHash])

        const result = await supertest(app).post("/sign-up").send(credentials)
        expect(result.status).toEqual(409)
    })
})

describe("POST /sign-in", () => {
    it("returns status 200 with user object for success", async () => {
        const credentials = {email: "teste@teste.com", password: "123456"}

        const result = await supertest(app).post("/sign-in").send(credentials)
        expect(result.status).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body).toHaveProperty('name')
        expect(result.body).toHaveProperty('token')
    })

    it("returns status 200 with token if user already have a active session", async () => {
        const credentials = {email: "teste@teste.com", password: "123456"}
       

        const result = await supertest(app).post("/sign-in").send(credentials)
        expect(result.status).toEqual(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body).toHaveProperty('name')
        expect(result.body).toHaveProperty('token')
    })

    it("returns status 401 if user doesn't exists or password incorrect", async () => {
        const credentials = {email: "teste@teste.com", password: "987654"}

        const result = await supertest(app).post("/sign-in").send(credentials)
        expect(result.status).toEqual(401)
    })
})

describe("POST /logout", () => {
    it("returns status 200 for success", async () => {
        const token = uuidv4()
        await connection.query(`
            INSERT INTO sessions 
            (user_id, token)
            VALUES ($1, $2)
        `, ["4", token])

        const result = await supertest(app).post("/logout").set({Authorization: token})
        expect(result.status).toEqual(200)
    })

    it("returns status 401 if no token is given", async () => {
        const result = await supertest(app).post("/logout").set({Authorization: ""})
        expect(result.status).toEqual(401)
    })
    
})