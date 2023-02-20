import bcrypt from 'bcrypt'
import { IUser } from '~~/types/IUser';
import { createUser } from '~~/server/database/repositories/userRepository';
import { doesUserExist } from '~~/server/services/userService';
export default defineEventHandler( async (event)=> {
    const body = await readBody(event);
    const { name, username, email, password } = body.data;
    const userExists = await doesUserExist(email, username);

    if (userExists.value === true ) {
        sendError(event, createError({statusCode: 422, statusMessage: userExists.message }))
    }

    const encryptedPassword: string = await bcrypt.hash(password, 10);

    const userData: IUser = {
        username,
        email,
        name,
        loginType: 'email',
        password: encryptedPassword
    }

    const user = await createUser(userData);
    // return await makeSession(user, event)

})