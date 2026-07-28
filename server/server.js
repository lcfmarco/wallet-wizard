const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3100;

const path = require('path');
const result = require('dotenv').config({ path: path.resolve(__dirname, '../server/.env.development') });

const {Pool, Client} = require('pg');


const host = process.env.DB_HOST || "localhost";
const isLocal = host === "localhost" || host === "127.0.0.1";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());

app.get("/api/title", (req, res) => {
  res.json({ title: "Wallet Wizard" });
});


// CRUD for Transactions
app.get("/api/transaction", async (req, res) => {
  let client

  const selectedMonth = Number(req.query.month);
  const selectedYear = Number(req.query.year);

  if (!Number.isInteger(selectedMonth) || !Number.isInteger(selectedYear) || selectedMonth < 1 || selectedMonth > 12) {
    return res.status(400).json({
      error: "A valid month and year are required"
    });
  }

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));

    const resp = await client.query('SELECT t.*, c.name as category_name FROM transaction t JOIN category c ON t.category_id = c.id WHERE t.deleted_at is NULL AND t.date >= $1 AND t.date < $2 ORDER BY t.date DESC', [startDate, endDate]);
    res.json(resp.rows);
  } catch (err) {
    console.error(err);
    res.json({error: err});
  } finally {
    client?.release();
  }
});

app.get("/api/transaction/:id", async (req, res) => {
  let client;
  const { id } = req.params;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('SELECT t.*, c.name AS category_name FROM transaction t JOIN category c ON t.category_id = c.id WHERE t.deleted_at IS NULL AND t.id = $1', [id]);
    if (resp.rows.length === 0) {
      res.status(404).json({ error: 'Transaction not found' });
    } 
    res.json(resp.rows[0]);
  } catch (err) {
    res.json({error: err});
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

app.put("/api/transaction/:id", async (req, res) => {
  let client;
  const { id } = req.params;
  const { name, amount, description, category_id, date } = req.body;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query(
      'UPDATE transaction SET name = $1, amount = $2, description = $3, category_id = $4, date = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [name, amount, description, category_id, date, id]
    );

    if (resp.rows.length === 0) {
      res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(resp.rows[0]);
  } catch (err) {
    res.json({error: err});
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

app.post("/api/transaction/:id", async (req, res) => {
  let client;
  const { id } = req.params;
  console.log(req.body);
  const { name, amount, description, category_id, date } = req.body;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('INSERT INTO transaction (id, name, amount, description, category_id, date, created_at, updated_at) \
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())\
      ON CONFLICT (id) DO UPDATE SET \
        name = EXCLUDED.name, \
        amount = EXCLUDED.amount, \
        description = EXCLUDED.description, \
        category_id = EXCLUDED.category_id, \
        date = EXCLUDED.date, \
        updated_at = NOW() \
      RETURNING *', [id, name, amount, description, category_id, date]);
    res.json(resp.rows[0]);
  } catch (err) {
    res.json({error: err});
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

app.delete("/api/transaction/:id", async (req, res) => {
  let client;
  const { id } = req.params;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('UPDATE transaction SET deleted_at = NOW() WHERE id = $1;', [id]);
    if (resp.rowCount === 0) {
      res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.json({ error: err });
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

// CRUD for Categories
app.get("/api/category", async (req, res) => {
  let client
  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('SELECT c.id, c.name as category_name, c.created_at FROM category as c WHERE c.deleted_at is NULL ORDER BY category_name ASC');
    res.json(resp.rows);
  } catch (err) {
    console.error(err);
    res.json({error: err});
  } finally {
    client?.release();
  }
});

app.get("/api/category/:id", async (req, res) => {
  let client;
  const { id } = req.params;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('SELECT c.id, c.name, c.created_at FROM category as c WHERE c.deleted_at is NULL AND c.id = $1', [id]);
    if (resp.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    } 
    res.json(resp.rows[0]);
  } catch (err) {
    res.json({error: err});
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

app.put("/api/category/:id", async (req, res) => {
  let client;
  const { id } = req.params;
  const { name } = req.body;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query(
      'UPDATE category SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (resp.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(resp.rows[0]);
  } catch (err) {
    res.json({error: err});
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

app.delete("/api/category/:id", async (req, res) => {
  let client;
  const { id } = req.params;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');
    const resp = await client.query('UPDATE category SET deleted_at = NOW() WHERE id = $1;', [id]);

    if (resp.rowCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.json({ error: err });
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

app.post("/api/category/:id", async (req, res) => {
  let client;
  const { id } = req.params;
  const { name } = req.body;

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');

    const existingCategory = await client.query('SELECT id, deleted_at FROM category WHERE LOWER(name) = LOWER($1)', [name]);

    if (existingCategory.rows.length > 0) {
      const category = existingCategory.rows[0];

      if (category.deleted_at === null) {
        return res.status(400).json({ error: 'Category with this name already exists' });
      }
      
      const restoredCategory = await client.query('UPDATE category SET deleted_at = NULL, updated_at = NOW() WHERE id = $1 RETURNING *', [category.id]);
      return res.json(restoredCategory.rows[0]);
    }

    const newCategory = await client.query('INSERT INTO category (id, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *;', [id, name]);
    res.json(newCategory.rows[0]);
  } catch (err) {
    res.json({error: err});
    console.log(err);
  } finally {
    client?.release();
    console.log('Finally');
  }
});

// Dashboard
app.get("/api/dashboard/monthly", async (req, res) => {
  let client;

  const selectedMonth = Number(req.query.month);
  const selectedYear = Number(req.query.year);

  if (!Number.isInteger(selectedMonth) || !Number.isInteger(selectedYear) || selectedMonth < 1 || selectedMonth > 12) {
    return res.status(400).json({
      error: "A valid month and year are required"
    });
  }

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));

    const summaryResp = await client.query('SELECT COALESCE(SUM(t.amount), 0) as total_spent, COUNT(*) as transaction_count FROM transaction t WHERE t.deleted_at is NULL AND t.date >= $1 AND t.date < $2', [startDate, endDate]);
    const spendingSummary = summaryResp.rows[0];

    const categorySummaryResp = await client.query('SELECT c.id as category_id, c.name as category_name, COUNT(t.id) as transaction_count, COALESCE(SUM(t.amount), 0) as total_spent FROM category c LEFT JOIN transaction t ON c.id = t.category_id AND t.deleted_at is NULL AND t.date >= $1 AND t.date < $2 WHERE c.deleted_at is NULL GROUP BY c.id, c.name ORDER BY total_spent DESC', [startDate, endDate]);
    const categorySummary = categorySummaryResp.rows.map(row => ({
      categoryId: row.category_id,
      categoryName: row.category_name,
      transactionCount: Number(row.transaction_count),
      totalSpent: Number(row.total_spent),
    }));

    res.json({
      period: {
        month: selectedMonth,
        year: selectedYear,
      },
      summary: {
        totalSpent: Number(spendingSummary.total_spent),
        transactionCount: Number(spendingSummary.transaction_count),
      },

      categorySummary: categorySummary,
    });
  }
  catch (err) {
    res.status(500).json({error: "Unable to retrieve monthly dashboard"});
    console.log(err);
  } finally {
    client?.release()
    console.log('Finally');
  }
});

// Analytics
app.get("/api/analytics/monthly", async (req, res) => {
  let client;

  const selectedMonth = Number(req.query.month);
  const selectedYear = Number(req.query.year);

  if (!Number.isInteger(selectedMonth) || !Number.isInteger(selectedYear) || selectedMonth < 1 || selectedMonth > 12) {
    return res.status(400).json({
      error: "A valid month and year are required"
    });
  }

  try {
    client = await pool.connect();
    console.log('Got a connection from the pool');

    const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
    const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));

    const summaryResp = await client.query('SELECT COALESCE(SUM(t.amount), 0) as total_spent, COUNT(*) as transaction_count, COUNT(DISTINCT t.date::date) AS active_days FROM transaction t WHERE t.deleted_at is NULL AND t.date >= $1 AND t.date < $2', [startDate, endDate]);
    const spendingSummary = summaryResp.rows[0];

    const largestTransactionResp = await client.query('SELECT t.id, t.name, t.date, t.amount, t.description, c.name as category_name FROM transaction t JOIN category c ON t.category_id = c.id WHERE t.deleted_at is NULL AND t.date >= $1 AND t.date < $2 ORDER BY t.amount DESC, t.date DESC LIMIT 1', [startDate, endDate]);
    const largestTransaction = largestTransactionResp.rows[0] ? {
      ...largestTransactionResp.rows[0],
      amount: Number(largestTransactionResp.rows[0].amount)
    } : null;

    const previousStartDate = new Date(Date.UTC(selectedYear, selectedMonth - 2, 1));
    const previousEndDate = startDate;
    const previousMonthResp = await client.query('SELECT COALESCE(SUM(t.amount), 0) as previous_month_spent FROM transaction t WHERE t.deleted_at is NULL AND t.date >= $1 AND t.date < $2', [previousStartDate, previousEndDate]);
    const previousMonthSpending = previousMonthResp.rows[0].previous_month_spent

    const categorySummaryResp = await client.query('SELECT c.id as category_id, c.name as category_name, COUNT(t.id) as transaction_count, COALESCE(SUM(t.amount), 0) as total_spent FROM category c LEFT JOIN transaction t ON c.id = t.category_id AND t.deleted_at is NULL AND t.date >= $1 AND t.date < $2 WHERE c.deleted_at is NULL GROUP BY c.id, c.name ORDER BY total_spent DESC', [startDate, endDate]);
    const categorySummary = categorySummaryResp.rows.map(row => ({
      categoryId: row.category_id,
      categoryName: row.category_name,
      transactionCount: Number(row.transaction_count),
      totalSpent: Number(row.total_spent),
    }));

    res.json({
      period: {
        month: selectedMonth,
        year: selectedYear,
      },
      summary: {
        totalSpent: Number(spendingSummary.total_spent),
        transactionCount: Number(spendingSummary.transaction_count),
        averageTransaction: Number(spendingSummary.transaction_count) > 0 ? Math.round(Number(spendingSummary.total_spent) / Number(spendingSummary.transaction_count)): 0,
        activeDays: Number(spendingSummary.active_days),
        averageActiveDaySpending: Number(spendingSummary.active_days) > 0 ? Math.round(Number(spendingSummary.total_spent) / Number(spendingSummary.active_days)) : 0,
      },
      largestTransaction: largestTransaction,
      lastMonthSpending: {
        totalSpent: Number(previousMonthSpending),
        difference: Number(spendingSummary.total_spent) - Number(previousMonthSpending),
        percentageChange: Number(previousMonthSpending) > 0 ? Math.round((Number(spendingSummary.total_spent) - Number(previousMonthSpending)) / Number(previousMonthSpending) * 1000) / 10 : null
      },
      categorySummary: categorySummary,
    });
  }
  catch (err) {
    res.status(500).json({error: "Unable to retrieve monthly dashboard"});
    console.log(err);
  } finally {
    client?.release()
    console.log('Finally');
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });