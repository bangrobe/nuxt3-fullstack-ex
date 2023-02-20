import { IUser } from "~~/types/IUser";
import { ISession } from '../types/ISession';

export const useAuthCookie = () => useCookie('auth_token');

export const useUser = async (): Promise<IUser> => {
    const authCookie = useAuthCookie().value;
    const user = useState<IUser>('user')

    if (authCookie && !user.value) {
        const { data } = await useFetch(`/api/auth/getByAuthToken`, {
            headers: useRequestHeaders(['cookie'])
        })
        user.value = data.value;
    }
    return user.value
}

export const registerWithEmail = async( username: string, name: string, email: string, password: string): Promise<FormValidation> => {
    try {
        const { data, error } = await useFetch<ISession>(`/api/auth/register`, {
            method: 'POST',
            body: {
                data: {
                    username, name, email, password
                }
            }
        })
        if (error.value) {
            type ErrorData = {
                data: ErrorData
            }
            const errorData = error.value as unknown as ErrorData
            const errors = errorData.data.data as unknown as string
            const res = JSON.parse(errors)
            const errorMap = new Map<string, { check: InputValidation}>(Object.entries(res))
            return { hasErrors: true, errors: errorMap}
        }

        if (data) {
            useState('user').value = data
            await useRouter().push('/dashboard')
        }
    } catch (error) {
        console.log(error)
    }
}

export const loginWithEmail = async (email: string, password: string) => {
    const user = await $fetch<IUser>('/api/auth/login', {
        method: 'POST',
        body: { emai: email, password: password}
    })
    useState('user').value = user;
    await useRouter().push('/dashboard')
}