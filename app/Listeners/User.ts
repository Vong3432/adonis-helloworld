import { EventsList } from '@ioc:Adonis/Core/Event'
import Pusher from 'pusher'
import Env from '@ioc:Adonis/Core/Env'

let pusher = new Pusher({
    appId: Env.get('PUSHER_APP_ID', ''),
    key: Env.get('PUSHER_KEY', ''),
    secret: Env.get('PUSHER_SECRET', ''),
    cluster: Env.get('PUSHER_CLUSTER', ''),
    encrypted: true
})

export default class User {
    public async onNewUser(user: EventsList['new:user']) {
        // do something
        console.log('listen', user)

        pusher.trigger('adonis-channel', 'send-message', {
            message: 'You are logged in !'
        })
    }
}
