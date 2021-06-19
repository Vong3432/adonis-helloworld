import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'


export default class PostsController {
    public async index({request}: HttpContextContract) {
        const posts = await Post
                            .query()
                            .preload('user')
                            .preload('forum');
        return posts;
    }
    public async show({bouncer, params, response}: HttpContextContract) {
        try {
            const post = await Post.findOrFail(params.id);
            
            // authorization via actions
            // if(await bouncer.denies('viewPost', post))
            //     throw "You are not allowed to view this post."

            // authorization via policy
            await bouncer.with('PostPolicy').authorize('view', post)

            if(post) {
                await post.preload('user')
                await post.preload('forum')
                return post;
            }

        } catch(error) {
            return response.status(500).json({msg: error})
        }
    }
    public async update({auth, request, params}: HttpContextContract) {
        const post = await Post.find(params.id)
        if(post) {
            post.title = request.input('title')
            post.content = request.input('content')
            if(await post.save()) {
                await post.preload("user")
                await post.preload("forum")
                return post
            }
            return; // 422
        }
        return; // 401
    }
    public async store({auth, request, response}: HttpContextContract) {
        const user = await auth.authenticate();
        const post = new Post();

        post.title = request.input('title')
        post.content = request.input('content')
        post.forumId = request.input('forum')

        await user.related('posts').save(post)
        
        return post;
    }
    public async destroy({auth, response, params}: HttpContextContract) {
        const user = await auth.authenticate();
        
        await Post
            .query()
            .where('user_id', user.id)
            .where('id', params.id)
            .delete();

        return response.status(200).json({
            msg: 'Post removed successfully'
        })
    }

}
