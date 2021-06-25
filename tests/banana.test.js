import supertest from 'supertest'
import app from '../src/app.js'
import connection from '../src/database.js'

beforeEach(async () => {
    
})

afterAll(() => {
    connection.end()
})

describe("GET /banana", () => {
    it("returns status 200 for valid params", async () => {
        const result = await supertest(app).get("/banana")
        expect(result.status).toEqual(200)
    })
})