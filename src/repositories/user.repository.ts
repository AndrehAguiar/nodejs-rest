import db from '../db';
import DatabaseError from "../models/catchs/database.error.model";
import User from "../models/user.model";

class UserRepository {

    async findAllUsers(): Promise<Array<User>> {
        try {
            const query = `
        SELECT uuid, username
            FROM application_user
        `;

            const { rows } = await db.query<User>(query);
            return rows || [];
        } catch (err) {
            throw new DatabaseError(`Erro na consulta de usuários`, err);
        } finally {
            db.end;
        }
    }

    async findById(uuid: string): Promise<User> {
        try {
            const query = `
                SELECT uuid, username
                    FROM application_user
                    WHERE uuid = $1
            `;
            const values = [uuid]
            const { rows } = await db.query<User>(query, values);
            const [user] = rows;
            return user;
        } catch (err) {
            throw new DatabaseError(`Erro na consulta por ID\nUUID = ${uuid}`, err);
        } finally {
            db.end;
        }
    }

    async create(user: User): Promise<String> {
        try {
            const script = `
            INSERT INTO application_user (
                username, 
                password
            )
            VALUES ($1, crypt($2, 'my_salt'))
            RETURNING uuid
            `;

            const values = [user.username, user.password];

            const { rows } = await db.query<{ uuid: string }>(script, values)
            const [newUser] = rows;
            return newUser.uuid;

        } catch (err) {
            throw new DatabaseError("Erro ao criar novo usuário", err);
        } finally {
            db.end;
        }
    }

    async update(user: User): Promise<void> {
        try {
            const script = `
            UPDATE application_user
            SET
                username = $1,
                password = crypt($2, 'my_salt')
            WHERE uuid = $3
        `;

            const values = [user.username, user.password, user.uuid];
            await db.query(script, values)

        } catch (err) {
            throw new DatabaseError(`Erro ao editar usuário\nUUID = ${user.uuid}`, err);
        } finally {
            db.end;
        }
    }

    async remove(uuid: string): Promise<void> {
        try {
            const script = `
            DELETE 
            FROM application_user
            WHERE uuid = $1
        `;

            const values = [uuid];
            await db.query(script, values)

        } catch (err) {
            throw new DatabaseError(`Erro ao excluir usuário\nUUID = ${uuid}`, err);
        } finally {
            db.end;
        }
    }

}

export default new UserRepository();