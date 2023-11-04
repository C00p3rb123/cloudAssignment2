import argon2 from "argon2";
import crypto from "crypto";
import { Encrypted } from "../types/types";

export const hashPassword = async (password: string) => {
  const startTime = new Date().getTime();
  const hashedPassword = await argon2.hash(password, {
    timeCost: 18,
    memoryCost: 500000,
  });

  const endTime = new Date().getTime();
  console.log(`${endTime - startTime}`);
  return hashedPassword;
};
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const result = await argon2.verify(hashedPassword, password);
  if (!result) {
    return false;
  }
  return true;
};

export const encryptPassword = (password: string) => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(process.env.SERVICE_KEY);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export const decryptPassword = (password: Encrypted) => {
  const iv = Buffer.from(password.iv, "hex");
  const encryptedText = Buffer.from(password.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.SERVICE_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
