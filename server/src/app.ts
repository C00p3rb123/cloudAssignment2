import express from "express";
import reisgterRouter from "../src/routes/account";
import storageRouter from "../src/routes/storage";
import { setRedis, getRedis, getS3, setS3 } from "./utils/utils";
import redis from "redis";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
