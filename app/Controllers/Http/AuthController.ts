import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'

export default class AuthController {
    public async login({request, auth}: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        const token = await auth.use("api").attempt(email, password, {
            expiresIn: "10 days"
        })

        await Event.emit('new:user', {id: 1, email: email})

        return token.toJSON()
    }

    public async register({request, auth}: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        const name = request.input('name')
        const newUser = new User();

        newUser.email = email;
        newUser.username = name;
        newUser.password = password;

        await newUser.save()

        const token = await auth.use("api").attempt(email, password, {
            expiresIn: "10 days"
        })

        return token.toJSON();
    }
}
