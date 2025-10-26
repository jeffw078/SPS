// api/search.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@libsql/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// 🔹 Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../")));

const client = createClient({
  url: "libsql://local-jeffw078.aws-us-east-2.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiIxMDgyNzgyNC1kYjk3LTQ3YjAtYTkzMC05OWQzOWRkMjMwYmEiLCJpYXQiOjE3NjEyNDkxNjAsInJpZCI6IjkzMDYyNGRjLWU1OGYtNDM2OC1hNTMxLTIzMWM1YzAzYjcyOSJ9.ZnBLEY0aWPlY0NQMR8B9gQy_MDQkAQL1rfjquXg0HFJYKCvojkgkHoEH2SSSn7PfXgHln-8yEQYartVSBxplAw",
});

// 🔹 API de busca (Turso)
app.get("/api/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
  const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);
  const exact = req.query.exact === "1";

  if (!q) return res.json({ rows: [], hasMore: false });

  try {
    let rows = [];

    if (exact) {
      const r = await client.execute({
        sql: `SELECT * FROM parts WHERE code = ? LIMIT 1;`,
        args: [q],
      });
      rows = r.rows;
      return res.json({ rows, hasMore: false });
    }

    const r = await client.execute({
      sql: `
        SELECT * FROM parts
        WHERE code  LIKE '%' || ? || '%'
           OR brand LIKE '%' || ? || '%'
           OR name  LIKE '%' || ? || '%'
        ORDER BY code
        LIMIT ? OFFSET ?;
      `,
      args: [q, q, q, limit, offset],
    });

    rows = r.rows;
    const hasMore = rows.length === limit;
    res.json({ rows, hasMore });
  } catch (err) {
    console.error("Turso error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// 🔹 URLs amigáveis → redirecionam para search.html com query
app.get(["/brand/:brand", "/part/:code", "/search/:term"], (req, res) => {
  const brand = req.params.brand;
  const code = req.params.code;
  const term = req.params.term;
  let query = "";

  if (brand) query = `?q=${encodeURIComponent(brand)}`;
  else if (code) query = `?q=${encodeURIComponent(code)}&exact=1`;
  else if (term) query = `?q=${encodeURIComponent(term)}`;

  res.redirect(`/search.html${query}`);
});

// 🔹 Página padrão
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../search.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ App rodando em: http://localhost:${PORT}`);
  console.log("➡  Teste: http://localhost:3001/brand/komatsu");
});
