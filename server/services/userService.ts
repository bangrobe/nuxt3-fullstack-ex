type ExistsCheck = {
    value: boolean
    message?: string
}

type RegistrationErrors = {
    emailError?: string
    usernameError?: string
}
import { getUserByEmail, getUserByUsername } from "../database/repositories/userRepository"
export async function doesUserExist(email: string, username: string): Promise<ExistsCheck> {
    const hasEmail = await getUserByEmail(email)
    console.log('has email',hasEmail)
    const hasUsername = await getUserByUsername(username)
    console.log('has username',hasUsername)
    const emailExists = hasEmail !== null
    const usernameExists = hasUsername !== null

    const errors: RegistrationErrors = {}

    if (emailExists) {
        errors.emailError = `This email, ${email} is already registered!`
    }

    if (usernameExists) {
        errors.usernameError = `The username, ${username} is already registered!`
    }
    if (emailExists || usernameExists) {
        const message = JSON.stringify(errors)
        return {
            value: true,
            message
        }
    }

    //If not errors
    return {
        value: false
    }
}