import bcrypt, { hash } from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import { hashPassword } from "../utils/utils";
import { Service } from "../types/types";
import { UserInfo, decodeToken } from "../utils/jwt";

const router = express.Router();

router.use(express.json());

router.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  try {
    const user = decodeToken(token);
    req["user"] = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
});

router.get("/list", async (req, res) => {
  const userEmail = req["user"]?.email;
  console.log(`${userEmail} request list-services`);
  res.send(["netflix", "youtube", "facebook", "instagram", "twitter"]);
});

router.get(":platform", async (req, res) => {
  const service: Service = {
    platform: "netflix",
    username: "username",
    password: "password",
  };
  res.send(service);
});

router.post("/add", async (req, res) => {
  const userEmail = req["user"]?.email;
  const service: Service = req.body.data;
  console.log(`${userEmail} request add-service`);
  console.log(service);
  res.sendStatus(200);
});

// router.post("/store", async (req: Request, res: Response) => {
// const services: Service[] = req.body.data;

// try{
// const passwords: string[] = []

// })
// res.send({
// data: passwords
// })
// res.status(200);
// }catch(err: any){
// console.log(`${err.message}\nUnable to hash password`);
// res.status(400).json({
// error: err,
// Message: err.message
// })
// }
// })
export default router;
