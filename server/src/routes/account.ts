import bcrypt, { hash } from "bcrypt";
import express, { Request, Response } from "express";
import {gets3, hashPassword, setS3} from "../utils/utils"


const router = express.Router();

router.use(express.json());

router.post("/create-account", async (req: Request, res: Response) => {
    console.log(req.body)
    const {email, password} = req.body;

    try{
        const hashedPassword = await hashPassword(password);
        const isEmail = await gets3(email);
        if(isEmail){
            res.status(400);
            res.send({
                error: true,
                message: "Account already exists"
            })
            return
        }
        await setS3(email, hashedPassword)
        res.status(200);
        res.send({
            message: "Hello There",
            password: hashedPassword
        })
    }catch(err: any){
        console.log(`${err.message}\nUnable to hash password`);
        res.status(400).json({
            error: err,
            Message: err.message
        })
    }  
})

router.post("/login", async (req: Request, res: Response) => {
    console.log(req.body)
    const {email, password} = req.body;

    try{
        const hashedPassword = await hashPassword(password);
        await setS3(email, hashedPassword)
        res.status(200);
        res.send({
            message: "Hello There",
            password: hashedPassword
        })
    }catch(err: any){
        console.log(`${err.message}\nUnable to hash password`);
        res.status(400).json({
            error: err,
            Message: err.message
        })
    }  
})

export default router