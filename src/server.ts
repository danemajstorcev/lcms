import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import "dotenv/config";

const app = express();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

interface Load {
  load_number: string;
  broker_id: number;
  carrier_id: number;
  [key: string]: any;
}

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/loads", async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM v_load_profit ORDER BY pickup_date DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /loads error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/loads", async (req: Request, res: Response) => {
  try {
    const { load_number, broker_id, carrier_id }: Load = req.body;

    const [result] = await pool.query(
      `INSERT INTO loads (load_number, broker_id, carrier_id)
       VALUES (?, ?, ?)`,
      [load_number, broker_id, carrier_id],
    );

    res.json({
      id: (result as mysql.ResultSetHeader).insertId,
    });
  } catch (err) {
    console.error("POST /loads error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/loads/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { load_number, broker_id, carrier_id }: Load = req.body;

    await pool.query(
      `UPDATE loads 
       SET load_number = ?, broker_id = ?, carrier_id = ?
       WHERE id = ?`,
      [load_number, broker_id, carrier_id, id],
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /loads error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/loads/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM loads WHERE id = ?", [id]);

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /loads error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
