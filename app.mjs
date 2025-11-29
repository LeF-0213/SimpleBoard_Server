import express from "express";
import cors from "cors";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";
import authRouter from "./router/auth.mjs";
import postRouter from "./router/posts.mjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({ origin: "*" }));

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

connectDB()
  .then(() => {
    app.listen(config.host.port);
  })
  .catch(console.error);
