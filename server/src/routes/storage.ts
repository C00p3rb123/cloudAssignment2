import express from "express";
import { ServiceRequest, ServiceStored } from "../types/types";
import { decodeToken } from "../utils/jwt";
import { encryptPassword, decryptPassword } from "../utils/security";
import { getRedis, setRedis } from "../utils/redisClient";
import { getS3, setS3 } from "../utils/s3Client";

const router = express.Router();

router.use(express.json());

router.use(async (req, res, next) => {
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
  try {
    const userEmail = req["user"]?.email;
    console.log(`${userEmail} request list-services`);
    const key = `user:${userEmail}:services`;
    const cachedServiceList = await getRedis(key);
    if (cachedServiceList) {
      res.status(200).json(cachedServiceList);
      return;
    }
    const userMasterFile = await getS3(userEmail);
    const credentials: ServiceStored[] = userMasterFile.value.services;
    const serviceList = credentials.map((c) => c.platform);
    await setRedis(key, serviceList);
    res.status(200).json(serviceList);
  } catch (err) {
    console.log(`${err.message}`);
    res.status(400).json({
      error: err,
      Message: err.message,
    });
  }
});

router.get("/:platform", async (req, res) => {
  try {
    const platform = req.params.platform;
    const userEmail = req["user"]?.email;
    const key = `user:${userEmail}:services:${platform}`;
    const cachedCredential = await getRedis(key);
    if (cachedCredential) {
      res.status(200).json(cachedCredential);
      return;
    }
    const userMasterFile = await getS3(userEmail);
    const credentials: ServiceStored[] = userMasterFile.value.services;
    const requestedPlatform: ServiceStored[] = credentials.filter(
      (service) => service.platform === platform
    );
    if (requestedPlatform.length === 0) {
      res.status(400).json({
        error: true,
        Message: "Platform not found",
      });
      return;
    }
    const returnedPlatform: ServiceRequest = {
      ...requestedPlatform[0],
      password: decryptPassword(requestedPlatform[0].password),
    };
    await setRedis(key, returnedPlatform);
    res.status(200).json(returnedPlatform);
  } catch (err) {
    console.log(`${err.message}`);
    res.status(400).json({
      error: err,
      Message: err.message,
    });
  }
});

router.post("/add-service", async (req, res) => {
  try {
    const userEmail = req["user"]?.email;
    const service: ServiceRequest = req.body;
    const user = await getS3(userEmail);
    const userServices: ServiceStored[] = user.value.services;
    userServices.forEach((userService) => {
      if (userService.platform === service.platform) {
        throw new Error(`Service already stored`);
      }
    });
    const encryptedPassword = encryptPassword(service.password);
    userServices.push({
      platform: service.platform,
      username: service.username,
      password: encryptedPassword,
    });
    user.value.services = userServices;
    await setS3(userEmail, user.value);
    console.log(`${userEmail} request add-service`);
    console.log(service);
    const key = `user:${userEmail}:services`;
    await setRedis(
      key,
      userServices.map((s) => s.platform)
    );
    res.status(200).json({
      Message: `Successfully stored service: ${service.platform} with user: ${service.username}`,
    });
  } catch (err) {
    console.log(`${err.message}`);
    res.status(400).json({
      error: err,
      Message: err.message,
    });
  }
});
export default router;
