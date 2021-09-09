import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from 'http-status-codes';
import userRepository from "../repositories/user.repository";

const usersRoute = Router();

// Busca todos os usuários
usersRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    const users = await userRepository.findAllUsers();
    res.status(StatusCodes.OK).send(users);
});

// Busca um usuário específico com o UUID informado
usersRoute.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid;
        const user = await userRepository.findById(uuid);
        res.status(StatusCodes.OK).send(user);
    } catch (err) {
        next(err);
    }
});

// Cria um novo usuário
usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = req.body;
        const uuid = await userRepository.create(newUser);
        res.status(StatusCodes.CREATED).send(uuid);
    } catch (err) {
        next(err);
    }
});

// Edita um usuário específico com o UUID informado
usersRoute.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid;
        const userToModified = req.body;
        userToModified.uuid = uuid;

        await userRepository.update(userToModified)

        res.status(StatusCodes.OK).send();
    } catch (err) {
        next(err);
    }
});

// Deleta um usuário específico com o UUID informado
usersRoute.delete('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid;
        await userRepository.remove(uuid);
        res.sendStatus(StatusCodes.OK).send()
    } catch (err) {
        next(err);
    }
});

export default usersRoute;