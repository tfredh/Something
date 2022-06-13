import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function validateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    /**
     * Check if user exists and the information in the jwt token has not changed
     */

    const accessToken = req.header("accessToken");
    if (!accessToken)
        return res.send({ error: "In validateToken: no accessToken passed" });

    /**
     * Verifying the token
     *
     * The try block will try to verify the token and if it fails, an error will be thrown
     *
     * The catch block will handle the error
     */
    try {
        const validToken = verify(accessToken, "secret") as any;

        // stick username and id on request for future use
        req.user = validToken;
        if (validToken) return next();
    } catch (err) {
        return res.send({ error: err });
    }
}
