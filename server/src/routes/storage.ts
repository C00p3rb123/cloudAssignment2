import bcrypt, { hash } from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import {  getS3, setS3, setRedis, getData  } from "../utils/utils";
import {ServiceRequest, ServiceStored } from "../types/types";
import { UserInfo, decodeToken } from "../utils/jwt";
import { set } from "mongoose";
import { encryptPassword, decryptPassword } from "../utils/security";
import * as redis from 'redis';

const router = express.Router();

router.use(express.json());

router.use( async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  try {
    const user = decodeToken(token);
    req["user"] = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
});

router.get("/list", async (req, res) => {
  try{
    const redisClient = redis.createClient();
  await redisClient.connect();
  const userEmail = req["user"]?.email;
  console.log(`${userEmail} request list-services`);
  const data = await getData(userEmail, redisClient );
  if(!data){
    res.status(400).json({
      error: true,
      Message: "No services stored"
  })
  return;
  }
  const list = data.map((service) => {
    return service.platform;
  })  
  await redisClient.quit();
  res.status(200).json({
    data: list
  });
  } catch(err){
    console.log(`${err.message}`);
    res.status(400).json({
        error: err,
        Message: err.message
    })
  }
  
});

router.get("/:platform", async (req, res) => {
  try{
    const redisClient = redis.createClient();
    await redisClient.connect();  
    const platform = req.params.platform;
    const userEmail = req["user"]?.email;
    const data = await getData(userEmail, redisClient);
    const requestedPlatform: ServiceStored[]= data.filter((service) => (service.platform === platform));
    if(requestedPlatform.length === 0){
      
      res.status(400).json({
          error: true,
          Message: "Platform not found"
      })
      return;
    }
    const returnedPlatform : ServiceRequest = {
      ...requestedPlatform[0],
      password: decryptPassword(requestedPlatform[0].password)
    }   
    await redisClient.quit();
    res.status(200).json({
      data: returnedPlatform
    })
  }catch(err){
    console.log(`${err.message}`);
    res.status(400).json({
        error: err,
        Message: err.message
    })
  }

});

router.post("/add-service", async (req, res) => {
  try{  
    const userEmail = req["user"]?.email;
    const service: ServiceRequest = req.body.data;
    const user = await getS3(userEmail);
    const userServices: ServiceStored[] = user.value.services;
    userServices.forEach((userService) => {
      if(userService.platform === service.platform){
        throw new Error(`Service already stored`);     
      }
    } )
    const encryptedPassword = encryptPassword(service.password);
    userServices.push({
      platform: service.platform,
      username: service.username,
      password: encryptedPassword
    })
    user.value.services = userServices;
    const redisClient = redis.createClient();
    await redisClient.connect();
    await setRedis(userEmail, userServices, redisClient );
    await setS3(userEmail, user.value);
    console.log(`${userEmail} request add-service`);
    console.log(service);
    await redisClient.quit();
    res.status(200).json({
      Message: `Successfully stored service: ${service. platform} with user: ${service.username}`
    });

  }catch(err){
    console.log(`${err.message}`);
    res.status(400).json({
        error: err,
        Message: err.message
    })
  }

});
export default router;
