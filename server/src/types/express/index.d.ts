// src/types/express/index.d.ts

import { UserInfo } from "../../utils/jwt";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserInfo;
    }
  }
}
