import express, { Request, Response } from "express";
import { createToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/security";
import { getRedis, setRedis } from "../utils/redisClient";
import { getS3, setS3 } from "../utils/s3Client";

const router = express.Router();

router.use(express.json());

router.post("/create-account", async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const isEmail = await getS3(email);
    if (isEmail) {
      res.status(400);
      res.send({
        error: true,
        message: "Account already exists",
      });
      return;
    }
    await setS3(email, {
      masterPassword: hashedPassword,
      services: [],
    });
    res.status(200);
    res.send({
      message: `Successfully created account`,
    });
  } catch (err: any) {
    console.log(`${err.message}\nUnable to hash password`);
    res.status(400).json({
      error: err,
      message: err.message,
    });
    console.log({
      error: err,
      message: err.message,
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const key = `user:${email}:masterPasswordHash`;
    let masterPasswordHash: string;
    const cachedCredential = await getRedis(key);
    console.log({ cachedCredential });
    if (cachedCredential) {
      masterPasswordHash = cachedCredential.value;
      console.log({ case: "cached", masterPasswordHash });
    } else {
      const user = await getS3(email);
      if (!user) {
        return res.status(400).json({
          error: true,
          message: "Account does not exist",
        });
      }
      console.log({ user });
      masterPasswordHash = user.value.masterPassword;
      await setRedis(key, masterPasswordHash);
    }
    console.log({ masterPasswordHash });
    const verified = await verifyPassword(password, masterPasswordHash);
    if (!verified) {
      return res.status(400).json({
        error: true,
        message: "Password does not match",
      });
    }
    const token = await createToken({ email: email });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200);
    res.json({ token });
  } catch (err: any) {
    console.log(`${err.message}\nUnable to hash password`);
    res.status(400).json({
      error: err,
      message: err.message,
    });
  }
});

export default router;
