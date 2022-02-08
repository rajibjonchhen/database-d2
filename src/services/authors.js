import { Router } from "express";
import pool from "../utils/db/connect.js";

const authorsRouter = Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM authors;`);
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

authorsRouter.get("/:author_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM authors WHERE author_id=$1;`,
      [req.params.author_id]
    );
    if (result.rows[0]) {
      res.send(result.rows);
    } else {
      res.status(404).send({ message: "No such author." });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `INSERT INTO authors(first_name,last_name) VALUES($1,$2) RETURNING *;`,
      [req.body.first_name, req.body.last_name]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

authorsRouter.put("/:author_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE authors SET first_name=$1,last_name=$2 WHERE author_id=$3 RETURNING * ;`,
      [req.body.first_name, req.body.last_name, req.params.author_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// dynamic sql update query generate

// authorsRouter.put("/:author_id", async (req, res, next) => {
//   try {
//     // first_name=$1,last_name=$2
//     const query = `UPDATE authors SET ${Object.keys(req.body)
//       .map((key, i) => `${key}=$${i + 1}`)
//       .join(",")} WHERE author_id=$${
//       Object.keys(req.body).length + 1
//     } RETURNING * ;`;
//     const result = await pool.query(query, [
//       ...Object.values(req.body),
//       req.params.author_id,
//     ]);
//     res.send(result.rows[0]);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

authorsRouter.delete("/:author_id", async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM authors WHERE author_id=$1;`, [
      req.params.author_id,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default authorsRouter;
