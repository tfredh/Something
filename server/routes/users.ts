import express from "express";
import { hashSHA256 } from "../utils/helpers";
import { sign } from "jsonwebtoken";
import { validateToken } from "../middlewares/auth-middleware";
import { db } from "../config/config";

console.log("users", __filename);
const router = express.Router();

// add user
router.post("/", (req, res) => {
    const { username, password: password_NOT_FOR_DATABASE } = req.body;
    const hashedPassword = hashSHA256(password_NOT_FOR_DATABASE);

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err, results) => {
            if (err) console.log(err);

            console.log("results", results);
            res.json("nice");
        }
    );
});

// authenticate user
router.post("/login", (req, res) => {
    const { username: inputtedUsername, password: inputtedPassword } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=(?) LIMIT 1",
        [inputtedUsername],
        (err, results: any[]) => {
            if (err) console.log(err);

            const user = results[0]; // user queried
            if (!user) return res.send({ error: "User not found" });

            if (user.password !== hashSHA256(inputtedPassword)) {
                res.send({ error: "Wrong password" });
            } else {
                // send the client encoded details to use in future authorization
                const accessToken = sign(
                    { username: user.username, id: user.id },
                    "secret"
                );
                res.send({
                    accessToken,
                    username: inputtedUsername,
                    id: user.id,
                });
            }
        }
    );
});

// send user info to client
router.get(
    "/auth",
    // (req, res, next) => {
    //     console.log(1);
    //     next();
    // },
    // (req, res, next) => {
    //     console.log(2);
    //     next();
    // },
    validateToken,
    (req, res) => {
        res.send(req.user);
    }
);

router.get("/basicinfo/:userId", (req, res) => {
    const { userId } = req.params;

    db.execute<any[]>(
        "SELECT username FROM users WHERE id = :userId LIMIT 1",
        { userId },
        (err, result) => {
            if (err) console.log(err);

            if (result.length === 0)
                return res.send({ userDoesNotExist: true });
            else {
                console.log(result[0]);
                res.send(result[0]);
            }
        }
    );
});

router.put("/cpass", validateToken, (req, res) => {
    const { oldPass, newPass } = req.body;
    const { username } = req.user!;

    db.execute<any[]>(
        `SELECT password FROM users WHERE username = :username`,
        { username },
        (err, result) => {
            if (err) console.log(err);
            else {
                const userDBPassword = result[0].password;

                if (userDBPassword === hashSHA256(oldPass)) {
                    db.execute(
                        `UPDATE users SET password = :password WHERE username = :username`,
                        { password: hashSHA256(newPass), username },
                        (err, result) => {
                            if (err) console.log(err);
                            else console.log(result);
                        }
                    );
                    res.send("Password updated");
                } else {
                    res.send({ error: "Wrong password" });
                }
            }
        }
    );
});

export default router;
