import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import AppError from "../error/appEror";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config";
import { TUserRole } from "../modiuls/users/user.interfach";
import { User } from "../modiuls/users/user.model";





const auth=(...requiredRoll:TUserRole[])=>{
    return catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
        const token=req.headers.authorization;


        if(!token){
            throw new AppError(httpStatus.NOT_FOUND,`You have not authrize`)
        }
       
        // jwt.verify(token,config.JWT_SECRET_ACCESS_KE as string,function(error,decoded){
        //     if(error){
        //         throw new AppError(httpStatus.UNAUTHORIZED,'You have not authrize')
        //     }
        //     // const {userId, role}=decoded

        //     const role=(decoded as JwtPayload)?.role
        //     if(requiredRoll && !requiredRoll.includes(role)){

        //         throw new AppError(httpStatus.BAD_REQUEST,`You are not auturize`)
        //     }

        //     req.user=decoded as JwtPayload
            
            
        //     next()
        // })

        const decoded=jwt.verify(token,config.JWT_SECRET_ACCESS_KE as string) as JwtPayload

        const {role,userId,iat}=decoded

        if(requiredRoll && !requiredRoll.includes(role)){
            throw new AppError(httpStatus.UNAUTHORIZED,`You are unauthorized Pleasr login and try again`)
        }


        const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
          user.passwordChangedAt,
          iat as number,
        )
      ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
      }



        req.user=decoded
        next()


    })
}

export default auth