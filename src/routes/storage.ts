import bcrypt, { hash } from "bcrypt";
import express, { Request, Response } from "express";
import {hashPassword} from "../utils/utils"
import argon2 from "argon2"
import { Service } from "../types/types";


const router = express.Router();

router.use(express.json());

router.post("/store", async (req: Request, res: Response) => {
    const services: Service[] = req.body.data;

    try{
        const passwords: string[] = []
        services.forEach(async (service) => {
            const startTime = new Date().getTime();
            const hashedPassword = await argon2.hash(service.password, {
                timeCost: 18, 
                memoryCost: 1000000, 
                })

            const endTime = new Date().getTime();
            passwords.push(hashedPassword)
            console.log(`${endTime - startTime}`);
        })
        res.send({
            data: passwords
        })
        res.status(200);
    }catch(err: any){
        console.log(`${err.message}\nUnable to hash password`);
        res.status(400).json({
            error: err,
            Message: err.message
        })
    }  
})
export default router