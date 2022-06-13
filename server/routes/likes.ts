import express from "express";
import { db } from "../config/config";
import { validateToken } from "../middlewares/auth-middleware";

console.log("likes", __filename);
const router = express.Router();

router.post("/", validateToken, (req, res) => {
    const { postId } = req.body;
    const username = req.user!.username;

    db.execute(
        "SELECT id from likes WHERE post_id=:postId AND username=:username LIMIT 1",
        {
            postId,
            username,
        },
        (err, result) => {
            if (err) console.log(err);

            // @ts-ignore
            if (result.length > 0) {
                db.execute(
                    "DELETE FROM likes WHERE post_id=:postId AND username=:username",
                    { postId, username },
                    (err, result) => {
                        if (err) console.log(err);
                        else {
                            console.log(result);
                            res.send({ liked: false });
                        }
                    }
                );
            } else {
                db.execute(
                    "INSERT INTO likes (post_id, username) VALUES (:postId, :username)",
                    { postId, username },
                    (err, result) => {
                        if (err) console.log(err);
                        else {
                            console.log(result);
                            res.send({ liked: true });
                        }
                    }
                );
            }
        }
    );
});

export default router;
