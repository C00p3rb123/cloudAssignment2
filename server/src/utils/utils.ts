
import AWS from "aws-sdk"
import dotenv from "dotenv"
import axios from "axios"
import * as redis from "redis"
import argon2 from "argon2"
import { ServiceStored } from "../types/types";

export const setRedis = async (key: string, value: ServiceStored[], redisClient: any) => {
    
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

export const getData = async (key: string, redisClient: any): Promise<ServiceStored[]> => {
    const redisData = await getRedis(key, redisClient);
    if(!redisData){
        const s3Data = await getS3(key);
        await setRedis(key, s3Data.value.services, redisClient)
        return s3Data.value.services
    }
    return redisData.value
}


























