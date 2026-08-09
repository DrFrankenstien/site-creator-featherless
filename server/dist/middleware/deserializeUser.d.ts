import type { NextFunction, Request, Response } from "express";
declare const deserializeUser: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export default deserializeUser;
//# sourceMappingURL=deserializeUser.d.ts.map