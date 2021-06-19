import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Post from 'App/Models/Post';
import User from 'App/Models/User';

interface IPolicyAction {
    [key: string]: {
        err: string
    }
}

const unthorized: IPolicyAction = {
    'view': {
        err: 'You are not allowed to view.'
    }
}

export default class PostPolicy extends BasePolicy {
    public async view(user: User, post: Post) {
        return post.userId === user.id
    }

    public async after(user: User | null, action, actionResult) {
        if(!actionResult.authorized) {
            throw unthorized[action].err
        }
    }
}
