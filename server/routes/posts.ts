import express from "express";
import { db } from "../config/config";
import { validateToken } from "../middlewares/auth-middleware";

console.log("posts", __filename);
const router = express.Router();

interface LikesTable {
    id: number;
    postId: number;
    username: string;
}

interface ResultQ {
    id: number;
    title: string;
    likes: LikesTable[];
}

router.get("/", validateToken, (req, res) => {
    const { username } = req.user!;

    db.query(
        `SELECT
            posts.*,
            IF(
                likes.id IS NOT NULL,
                json_arrayagg(
                    json_object(
                        'id', likes.id,
                        'postId', likes.post_id,
                        'username', likes.username
                    )
                ),
                json_array()
            ) AS likes
        FROM
            posts
            LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY
            posts.id
    `,
        (err, resultq: ResultQ) => {
            if (err) console.log(err);
            else {
                console.log(resultq);

                db.execute(
                    `SELECT * FROM likes WHERE username = :username`,
                    { username },
                    (err, result) => {
                        if (err) console.log(err);
                        else {
                            console.log(result);
                            res.send({
                                posts: resultq,
                                userLikedPosts: result,
                            });
                        }
                    }
                );
            }
        }
    );
});

router.get("/byId/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT title, username FROM posts WHERE id=(?) LIMIT 1",
        [id],
        (err, result) => {
            if (err) console.log(err);
            else {
                console.log("post info:", result);
                res.send(result);
            }
        }
    );
});

router.post("/", validateToken, (req, res) => {
    const { title } = req.body;
    const { id, username } = req.user!; // ! means that user is not null

    db.query(
        "INSERT INTO posts (title, username, user_id) VALUES (:title, :username, :userId)",
        { title, username, userId: id },
        (err, result) => {
            if (err) console.log(err);
            else {
                console.log("post created:", result);
                res.send({ status: "success" });
            }
        }
    );
});

router.delete("/:postId", validateToken, (req, res) => {
    const { postId } = req.params;
    const { username: posterUsername } = req.user!; // ! means that user is not null

    db.execute(
        `
        DELETE comments, likes
        FROM 
            comments
            JOIN likes ON comments.post_id = likes.post_id
        WHERE
            comments.post_id = :postId
    `,
        { postId },
        (err, result) => {
            if (err) console.log(err);
            else {
                db.execute(
                    "DELETE FROM posts WHERE id = :postId AND username = :posterUsername",
                    { postId, posterUsername },
                    (err, result) => {
                        if (err) console.log(err);
                        else {
                            console.log(result);
                            res.send({
                                status: "success: post deleted",
                            });
                        }
                    }
                );
            }
        }
    );
});

router.put("/title", validateToken, (req, res) => {
    const { newTitle, postId } = req.body;

    db.execute(
        `UPDATE posts SET title = :newTitle WHERE id = :postId`,
        { newTitle, postId },
        (err, result) => {
            if (err) console.log(err);
            else {
                console.log(result);
                res.send({ success: true });
            }
        }
    );
});

router.get("/byUser/:userId", (req, res) => {
    const { userId } = req.params;

    db.execute(
        `
        SELECT
            posts.*,
            IF (
                likes.id IS NOT NULL,
                json_arrayagg(
                    json_object(
                        'id', likes.id,
                        'postId', likes.post_id,
                        'username', likes.username
                    )
                ),
                json_array()
            ) AS likes
        FROM
            posts
            LEFT JOIN likes ON posts.id = likes.post_id
        WHERE
            posts.user_id = :userId
        GROUP BY
            posts.id
        `,
        { userId },
        (err, result) => {
            if (err) console.log(err);
            else {
                console.log(result);
                res.send(result);
            }
        }
    );
});

export default router;
