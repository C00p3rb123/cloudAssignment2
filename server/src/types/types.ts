export type User = {
    masterPassword: string,
    services: ServiceStored[],
}
export type Encrypted = {
    iv: string,
    encryptedData: string
}

export type ServiceRequest = {
    platform: string,
    username: string,
    password: string
}
export type ServiceStored = {
    platform: string,
    username: string,
    password: Encrypted
}

export type redisData = {
    services: Service[]
}