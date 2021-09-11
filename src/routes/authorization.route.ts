import { NextFunction, Request, Response, Router } from "express";
import { ForbiddenError } from "../models/catchs/forbidden.error.model";
import userRepository from "../repositories/user.repository";
import JWT from 'jsonwebtoken';


const authorizationRoute = Router();

authorizationRoute.post('/token', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            throw new ForbiddenError("Credenciais não informadas");
        }

        const [authenticationType, token] = authorizationHeader.split(' ');

        if (authenticationType !== 'Basic' || !token) {
            throw new ForbiddenError('Tipo de autenticação inválido');
        }

        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');

        const [username, password] = tokenContent.split(':');

        if (!username || !password) {
            throw new ForbiddenError('Credenciais não preechidas.');
        }

        const user = await userRepository.findUsernameAndPassword(username, password);

        if(!user){
            throw new ForbiddenError('Usuário e senha inválidos!');
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