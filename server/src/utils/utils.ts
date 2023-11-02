
import AWS from "aws-sdk"
import dotenv from "dotenv"
import axios from "axios"
import * as redis from "redis"
import argon2 from "argon2"
import { ServiceStored } from "../types/types";

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
    if (!result) {
        return false
    }
    return true
}

export const setRedis = async (key: string, value: ServiceStored[], redisClient: any) => {
    const result = await getRedis(key, redisClient);
    const userServices: ServiceStored[] = result.value;
    const platform = value[value.length - 1].platform
    userServices.forEach((userService) => {
        if (userService.platform === platform) {
            throw new Error('Service already stored')
        }
    }); 
    redisClient.setEx(
        key,
        3600,
        JSON.stringify({ source: "Redis Cache", value })
    );}

export const getRedis = async (key: string, redisClient: any) => {


    const redisKey = `${key}`;
    const result = await redisClient.get(redisKey);
    if (!result) {
        return;

    } const resultJSON = JSON.parse(result);
    return resultJSON
};

export const getS3 = async (key: string) => {
    const bucketName = process.env.S3_BUCKET;
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        region: "ap-southeast-2",
    });
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    const s3Key = `${key}`;
    const params = { Bucket: bucketName!, Key: s3Key };
    try {
        const s3Result = await s3.getObject(params).promise();

        // Serve from S3
        const s3JSON = JSON.parse(s3Result.Body?.toString()!);
        return s3JSON;

    } catch (err: any) {
        if (err.statusCode === 404) {
            // Serve from Wikipedia API and store in S3
            console.error(`Value not found`);
        } else {
            // Something else went wrong when accessing S3
            console.error(err.message);
        }
    }
}
export const setS3 = async (key: string, value: any) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        region: "ap-southeast-2",
    });
    const bucketName = process.env.S3_BUCKET;
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    const body = JSON.stringify({
        source: "S3 Bucket",
        value,
    });
    const objectParams = { Bucket: bucketName!, Key: key, Body: body };
    await s3.putObject(objectParams).promise();
    console.log(`Successfully uploaded data to ${bucketName}${key}`);

}

export const getData = async (key: string, redisClient: any) => {
    const redisData = await getRedis(key, redisClient);
    if(!redisData){
        const s3Data = await getS3(key);
        return s3Data.value.services
    }
    return redisData.value
}


























