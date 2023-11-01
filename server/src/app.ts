import express from "express";
import reisgterRouter from "../src/routes/account"
import storageRouter from "../src/routes/storage"
import { setRedis, getRedis, gets3, setS3 } from "./utils/utils";
import redis from "redis"
import dotenv from "dotenv"
import logger from "morgan"

const PORT = 3000;

const app = express();
dotenv.config();
app.use(logger("tiny"));

app.use(express.json());


app.get("/hello", (req, res) => {
    console.log("Hello World")
} )

app.post("/test-redis", async (req,res) => {
    try{
        const redisClient = redis.createClient();
        await redisClient.connect();
        console.log(process.env.AWS_ACCESS_KEY_ID)
        const {username, password} = req.body;
        const user = await getRedis(username, redisClient)
        if(user){
            res.send(user);
            res.status(200);
            return;
        }
        const s3User = await gets3(username);
        if(s3User){
            await setRedis(username, password, redisClient);
            res.send(s3User);
            res.status(200);
            return
        }
        await setRedis(username, password, redisClient);
        await setS3(username, password);   
        
    }catch(err: any){
        err.message;
    }  

  })

app.use("/register", reisgterRouter );
app.use("/storage", storageRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  
