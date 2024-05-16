
import {Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decode } from "punycode";

export const auth = (req:Request, res:Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            res.status(401).json({
                message: "Unauthorized access"
            });
            return;
        }

        //Decoded the token to see properties

        const decoded= jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        

        req.tokenData = {
            userId: decoded.userId,
            userRole: decoded.userRole,
            userEmail: decoded.userEmail,
            userFirstName:decoded.userFirstName
        }


        next();


    } catch (error) {
        res.status(401).json({
            message:"Invalid token provided"
        })
    }



}