import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY || "secret";

export type UserInfo = {
  email: string;
};

export const createToken = (payload: UserInfo) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  return token;
};

export const decodeToken = (token: string) => {
  const decoded = jwt.verify(token, secretKey);
  return decoded as UserInfo;
};
