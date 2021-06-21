import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Post from 'App/Models/Post';
import User from 'App/Models/User';

interface IPostActionInfo {
    err: string
}

type PostAction = 'view'

const unthorized: Record<PostAction, IPostActionInfo> = {
    view: {
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
