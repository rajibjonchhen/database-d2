import { Router } from "express";
import pool from "../utils/db/connect.js";

const blogsRouter = Router();

blogsRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM blogs JOIN authors ON blogs.author_id=authors.author_id;`
    );
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.get("/:blog_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM blogs JOIN authors ON blogs.author_id=authors.author_id WHERE blog_id=$1;`,
      [req.params.blog_id]
    );
    if (result.rows[0]) {
      res.send(result.rows);
    } else {
      res.status(404).send({ message: "No such blog." });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `INSERT INTO blogs(title,content,author_id) VALUES($1,$2,$3) RETURNING *;`,
      [req.body.title, req.body.content, req.body.author_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

blogsRouter.put("/:blog_id", async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE blogs SET title=$1,content=$2,cover=$3 WHERE blog_id=$4 RETURNING * ;`,
      [req.body.title, req.body.content, req.body.cover, req.params.blog_id]
    );
    res.send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// dynamic sql update query generate

// blogsRouter.put("/:author_id", async (req, res, next) => {
//   try {
//     // first_name=$1,last_name=$2
//     const query = `UPDATE blogs SET ${Object.keys(req.body)
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

blogsRouter.delete("/:blog_id", async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM blogs WHERE blog_id=$1;`, [
      req.params.blog_id,
    ]);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default blogsRouter;
