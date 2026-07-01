const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3100;

const path = require('path');
const result = require('dotenv').config({ path: path.resolve(__dirname, '../server/.env.development') });

const {Pool, Client} = require('pg');


const host = process.env.DB_HOST || "localhost";
const isLocal = host === "localhost" || host === "127.0.0.1";

const pool = new Pool({
  user: process.env.DB_USER,
  host,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

app.use(cors());


app.get("/api/home", (req, res) => {
  res.json({ message: "Welcome to Wallet Wizard Project" });
});


app.get("/api/transaction", async (req, res) => {
  let client
  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('SELECT * FROM transaction');
    res.json(resp.rows);
  } catch (err) {
    console.error(err);
    res.json({error: err});
  } finally {
    client?.release();
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });