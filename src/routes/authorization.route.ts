import { NextFunction, Request, Response, Router } from "express";
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from "../middlewares/basic.authentication.middleware";
import { ForbiddenError } from "../models/catchs/forbidden.error.model";

const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.user;

        if (!user) {
            throw new ForbiddenError("Usuário não informado");
        }

        const jwtPayload = { username: user.username };
        const jwtOptions = { subject: user?.uuid };
        const sercretKey = 'my_secret_key';

        JWT.sign(jwtPayload, sercretKey, jwtOptions);

    } catch (error) {
        next(error);
    }
});

export default authorizationRoute;