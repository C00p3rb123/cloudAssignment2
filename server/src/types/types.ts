export type User = {
    masterPassword: string,
    services: Service[],
    jwt?: string
}

export type Service = {
    platform: string,
    username: string,
    password: string
}

export type redisData = {
    services: Service[]
}