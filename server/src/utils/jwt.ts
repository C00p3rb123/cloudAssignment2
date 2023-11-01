import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export const createToken = (user: Object) => {
    const secretKey = process.env.SECRET_KEY 
    const token = jwt.sign(user, secretKey!, { expiresIn: '1h' });
    return token;
}