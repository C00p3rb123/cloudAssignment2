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
      return res.status(400).json({
        error: true,
        message: "Account already exists",
      });
    }
    await setS3(email, {
      masterPassword: hashedPassword,
      services: [],
    });
    return res.status(200).json({
      message: `Successfully created account`,
    });
  } catch (err: any) {
    console.log(`${err.message}\nUnable to hash password`);
    return res.status(400).json({
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
    if (cachedCredential) {
      masterPasswordHash = cachedCredential.value;
    } else {
      const user = await getS3(email);
      if (!user) {
        return res.status(400).json({
          error: true,
          message: "Account does not exist",
        });
      }
      masterPasswordHash = user.value.masterPassword;
      await setRedis(key, masterPasswordHash);
    }
    const verified = await verifyPassword(password, masterPasswordHash);
    if (!verified) {
      return res.status(400).json({
        error: true,
        message: "Password does not match",
      });
    }
    const token = await createToken({ email: email });
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({ token });
  } catch (err: any) {
    console.log(`${err.message}\nUnable to hash password`);
    return res.status(400).json({
      error: err,
      message: err.message,
    });
  }
});

export default router;
