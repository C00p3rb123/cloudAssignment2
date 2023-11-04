import express from "express";
import reisgterRouter from "../src/routes/account";
import storageRouter from "../src/routes/storage";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";
import { initClient } from "./utils/redisClient";

dotenv.config();

const PORT = 4000;
const app = express();
app.use(cors());
app.use(logger("tiny"));

app.use(express.json());

app.get("/hello", (req, res) => {
  console.log("Hello World");
  return res.send("hi");
});

app.use("/account", reisgterRouter);
app.use("/storage", storageRouter);

app.listen(PORT, async () => {
  await initClient();
  console.log(`Listening on port ${PORT}`);
});
