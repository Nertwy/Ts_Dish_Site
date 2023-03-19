import { DishLikes } from "@prisma/client";
import { NextFunction, Response } from "express";
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
    Request,
    // Response,
    Header,
    Res,
    TsoaResponse
} from "tsoa";
import { LoginInterface } from "../../interfaces/Ingridient";
import { User } from "../../interfaces/user";
import ApiErrors from "./errors";
import { checkEmailExists, deleteRefreshToken, getUserByEmail, getUserLikes, insertUser, storeRefreshToken } from "./postgre";
import { createAccessToken, createRefreshToken, sendRefreshToken, verifyRefreshToken } from "./token";

@Route("/")
export class Register extends Controller {
    @SuccessResponse("200", "created")
    @Post("/register")
    public async Register(@Body() userData: User): Promise<void> {
        try {
            if (await checkEmailExists(userData.email)) {
                throw new Error('Wrong data');
            }
            await insertUser(userData);
        } catch (e: any) {
            throw new Error(e);
        }
    }

}

@Route("/")
export class Login extends Controller {
    @SuccessResponse("202", "Logged In")
    @Post("/login")
    public async Login(@Body() body: User): Promise<LoginInterface> {
        let userData: User = body

        const refreshToken = createRefreshToken(userData);
        const accessToken = createAccessToken(userData);
        await storeRefreshToken(userData, refreshToken);
        const user = await getUserByEmail(userData.email!)
        const userLikes = await getUserLikes(user!.id)
        const userLogin: LoginInterface = {
            likes: userLikes,
            success: true,
            token: accessToken
        }
        this.setHeader('Set-Cookie', `jrt=${refreshToken}; HttpOnly`);
        return userLogin
    }
}
interface token {
    refreshToken: string
}
@Route("/")
export class Refresh extends Controller {
    // @SuccessResponse("202", "Logged In")
    @Get("/refresh")
    public async refreshToken(
        @Header("Set-Cookie") cookie: string)
        : Promise<string | void> {
        try {
            const jrt = cookie.split(';').find((c) => c.trim().startsWith('jrt='));
            if (!jrt) throw ApiErrors.BadRequest("No token In cookie");

            let payload: any = await verifyRefreshToken(jrt);
            // console.log(payload + "PAYLOAD");

            if (payload === null) throw ApiErrors.BadRequest("Invalid Token");
            // const user = await getUserByName(payload!.name);
            const user = await getUserByEmail(payload?.email);
            if (!user) throw Error("No user with this name");

            // if (user.tokens?.refresh !== token)
            //   return next(ApiErrors.BadRequest("User have wrong refresh Token!", []));
            //UPDATE REFRESH TOKEN IN DB THEN SEND NEW TO USER;
            const newRT = createRefreshToken(user);
            await deleteRefreshToken(jrt);
            await storeRefreshToken(user, newRT);
            const accessToken = createAccessToken(user)
            // writeRefreshTokenToDB(await getUserIdByName(user.name), newRT);
            // @Header("Set-Cookie",`jrt=${newRT}; Path=/; HttpOnly;`)
            return accessToken

        } catch (error) {

        }

    }
}