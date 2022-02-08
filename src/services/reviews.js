import { Router } from "express";
import pool from "../utils/db/connect.js";

const reviewsRouter = Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews JOIN products ON reviews.product_id=products.product_id;`
    );
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

reviewsRouter.get("/:review_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews JOIN products ON reviews.product_id=products.product_id WHERE review_id=$1;`,
      [req.params.review_id]
    );
    if (result.rows[0]) {
      res.send(result.rows);
    } else {
      res.status(404).send({ message: "No such review." });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `INSERT INTO reviews(title,content,product_id) VALUES($1,$2,$3) RETURNING *;`,
      [req.body.title, req.body.content, req.body.product_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

reviewsRouter.put("/:review_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE reviews SET title=$1,content=$2,cover=$3 WHERE review_id=$4 RETURNING * ;`,
      [req.body.title, req.body.content, req.body.cover, req.params.review_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// dynamic sql update query generate

// reviewsRouter.put("/:product_id", async (req, res, next) => {
//   try {
//     // first_name=$1,last_name=$2
//     const query = `UPDATE reviews SET ${Object.keys(req.body)
//       .map((key, i) => `${key}=$${i + 1}`)
//       .join(",")} WHERE product_id=$${
//       Object.keys(req.body).length + 1
//     } RETURNING * ;`;
//     const result = await pool.query(query, [
//       ...Object.values(req.body),
//       req.params.product_id,
//     ]);
//     res.send(result.rows[0]);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

reviewsRouter.delete("/:review_id", async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM reviews WHERE review_id=$1;`, [
      req.params.review_id,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default reviewsRouter;
