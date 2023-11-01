import bcrypt, { hash } from "bcrypt";
import express, { Request, Response } from "express";
import {hashPassword} from "../utils/utils"


const router = express.Router();

router.use(express.json());

router.post("/create-account", async (req: Request, res: Response) => {
    console.log(req.body)
    const {email, password} = req.body;

    try{
        const hashedPassword = await hashPassword(password);
        res.status(200);
        res.send({
            message: "Hello There"
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