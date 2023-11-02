import bcrypt from "bcrypt";
import argon2 from "argon2"
import crypto from "crypto"
import dotenv from "dotenv"
import { text } from "express";

const ALGORITHIM = ;

export const hashPassword = async (password: string) => {

    const startTime = new Date().getTime();
    const hashedPassword = await argon2.hash(password, {
        timeCost: 18, 
        memoryCost: 500000, 
        })

    const endTime = new Date().getTime();
    console.log(`${endTime - startTime}`);
    return hashedPassword;

};
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
const result = await argon2.verify(hashedPassword, password);
if(!result){
    return false
}
return true
}

export const encryptPassword = (password: string) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.SERVICE_KEY!), process.env.IV!);
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex')
}