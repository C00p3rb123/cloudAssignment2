import express, { Request, Response } from "express";
import { getS3, setS3 } from "../utils/utils";
import { createToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/security";

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
      Message: err.message,
    });
    console.log({
      error: err,
      Message: err.message,
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getS3(email);
    if (!user) {
      res.status(400);
      res.send({
        error: true,
        message: "Account does not exist",
      });
      return;
    }
    const verified = await verifyPassword(password, user.value.masterPassword);
    if (!verified) {
      res.status(400);
      res.send({
        error: true,
        message: "Password does not match",
      });
      return;
    }
    const token = await createToken({ email: email });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200);
    res.json({ token });
  } catch (err: any) {
    console.log(`${err.message}\nUnable to hash password`);
    res.status(400).json({
      error: err,
      Message: err.message,
    });
  }
});

export default router;
