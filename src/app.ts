import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { add } from './math.js';
import { api } from './api/index.js';
import { pinoHttp } from 'pino-http';
import postgres from 'postgres';


dotenv.config();
const sql  = postgres(
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/crypto'
);

const app = express();
const log = pinoHttp({
    name: 'server',
    quietReqLogger: true,
    level: 'debug'
});
app.use(log);

// Add JSON parsing middleware
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.get("/health", (request: Request, response: Response) => {
    const num1 = Number(request.query["num1"]) || 54;
    const num2 = Number(request.query["num2"]) || 10;

    response.status(200).send({
        ok: true,
        sum: add(num1, num2)
    });
});

app.get("/", async (_request: Request, response: Response) => {
    response.status(200).send("Server / route");

    const res = await sql`SELECT 1`;
    console.log(res);
});

app.listen(PORT, () => {
    console.log(`[Server]: running at http://localhost:${PORT}`);
}).on("error", async (error) => {
    // gracefully handle error
    await sql.end();
    throw new Error(error.message);
}).on("close", async () => {
    await sql.end();
    console.log("Database connection closed");
    console.log("Server closed");
});
