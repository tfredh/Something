import express from "express";
import cors from "cors";

import { PORT } from "./config/config";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import usersRouter from "./routes/users";
import likesRouter from "./routes/likes";

const application = express();
application.use(cors());
application.use(express.json());

// routes
application.use("/posts", postsRouter);
application.use("/comments", commentsRouter);
application.use("/auth", usersRouter);
application.use("/likes", likesRouter);

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

application.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});
console.log("test bruh");
console.log(__filename);
