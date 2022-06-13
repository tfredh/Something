import express from "express";
import { db } from "../config/config";
import { validateToken } from "../middlewares/auth-middleware";

console.log("comments", __filename);
const router = express.Router();

router.get("/:postId", (req, res) => {
    const { postId } = req.params;

    db.query(
        "SELECT id, comment, username FROM comments WHERE post_id=(?)",
        [postId],
        (err, results) => {
            if (err) console.log(err);

            console.log("comments:", results);
            res.send(results);
        }
    );
});

router.post("/", validateToken, (req, res) => {
    const { comment, postId } = req.body;

    console.log("can?", req.user);
    const { username, id } = req.user!;

    db.query(
        "INSERT INTO comments (comment, username, post_id) VALUES (?, ?, ?)",
        [comment, username, postId],
        (err, results) => {
            if (err) console.log(err);

            res.send({
                // @ts-ignore
                comment: { comment, username, id: results.insertId },
            });
            console.log(results);
        }
    );
});

router.delete("/:commentId", validateToken, (req, res) => {
    const { commentId } = req.params;

    db.query(
        "DELETE FROM comments WHERE id=(?)",
        [commentId],
        (err, results) => {
            if (err) console.log(err);
            res.send("success");

            console.log(results);
        }
    );
});

export default router;
