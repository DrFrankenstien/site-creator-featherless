import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[auth-debug] Request: ${req.method} ${req.url} - Auth Header: "${req.headers.authorization}"`);
    
    // Bypass preflight requests
    if (req.method === "OPTIONS") {
        return next();
    }

    let token = req.headers.authorization
    if (!token) {
        console.log(`[auth-debug] No token found. Returning 403.`);
        return res.status(403).json({ error: "Unauthorised" })
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        res.locals.admin = jwt.verify(token, process.env.SECRET_KEY || "secret")
        next()
    } catch (error) {
        console.log(`[auth-debug] Token verification failed:`, error);
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

export default deserializeUser