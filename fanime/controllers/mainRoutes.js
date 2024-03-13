const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const data = require('../data');

function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

function add(server){
    server.get('/', function(req, resp){
        postModel.find({}).lean().then(function(posts){
        console.log('Loading posts from database');
        let vals = new Array();
            for(const post of posts){
                const searchQuery = { user: post.username}
                userModel.findOne(searchQuery).lean().then(function(account){
                    vals.push({
                        _id : post._id.toString(),
                        username: post.username,
                        date: post.date,
                        title: post.title,
                        genre: post.genre,
                        description: post.description,
                        image: post.image,
                        comments: post.comments,
                        like: post.like.length,
                        dislike: post.dislike.length,
                        profilepicture: account.profilepicture
                    });
                });
            }
            resp.render('unregMain', {
                layout: 'index',
                title: 'Unregistered Page',
                posts: vals
            });
        });
    });

    server.get('/main', function(req, resp){
        postModel.find({}).lean().then(function(posts){
            console.log('Loading posts from database');
            let vals = new Array();
                for(const post of posts){
                    const searchQuery = {user: post.username}
                    userModel.findOne(searchQuery).lean().then(function(account){
                    vals.push({
                        _id : post._id.toString(),
                        username: post.username,
                        date: post.date,
                        title: post.title,
                        genre: post.genre,
                        description: post.description,
                        image: post.image,
                        comments: post.comments,
                        like: post.like.length,
                        dislike: post.dislike.length,
                        profilepicture: account.profilepicture
                    });
                    })
                    
                }
                console.log(data.loggedIn.profilepicture);
                resp.render('main', {
                    layout: 'index',
                    title: 'Unregistered Page',
                    posts: vals,
                    loggedprofilepicture: data.loggedIn.profilepicture,
                    loggedusername: data.loggedIn.username
                });
            });
    });

    // server.get('/profile', function(req, resp){
    //         let userData = data.users[data.loggedIn.username];   
    //         let profilePic = userData['profile-pic'] || 'https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg';
    //         let profileBanner = userData['profile-banner'] || 'https://wikitravel.org/upload/shared//6/6a/Default_Banner.jpg';
    //         let userBio = userData['user-bio'] || 'Default bio';
    //         let favAnime = userData['fav-anime'] || [];
    //         let favManga = userData['fav-manga'] || [];
    //         let posts = userData['posts'];
    //             resp.render('profile', {
    //                 layout: 'profileIndex',
    //                 title: 'Profile Page',
    //                 username: data.loggedIn.username,
    //                 pfp: profilePic,
    //                 banner: profileBanner,
    //                 bio: userBio,
    //                 favAnime: favAnime,
    //                 favManga: favManga,
    //                 posts: posts
    //             });
    // });

    server.get('/post', function(req, resp){
        const searchQuery = req.query.post_id;
        postModel.findById(searchQuery).lean().then(function(post){
            const post_data = {
                _id : post._id.toString(),
                username: post.username,
                date: post.date,
                title: post.title,
                genre: post.genre,
                description: post.description,
                image: post.image,
                comments: post.comments,
                like: post.like.length,
                dislike: post.dislike.length
            };
            resp.render('post', {
                layout: 'index',
                title: 'Post Page',
                post: post_data,
                loggedprofilepicture: data.loggedIn.profilepicture
            });
        })
    });

    server.get('/editpost', function(req, resp){
        let userData = data.users[data.loggedIn.username];  
        let profilePic = userData['profile-pic'] || 'https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg';
        resp.render('editpost', {
            layout: 'index',
            title: 'Edit Post Page',
            username: data.loggedIn.username,
            pfp: profilePic

        });
        
    });

    server.get('/editcomment', function(req, resp){
        let userData = data.users[data.loggedIn.username];  
        let profilePic = userData['profile-pic'] || 'https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg';
        resp.render('editcomment', {
            layout: 'index',
            title: 'Edit Comment Page',
            username: data.loggedIn.username,
            pfp: profilePic
        });
        
    });

    server.post('/create_post', function(req, resp){
        const { title, date, genre, description, image} = req.body;

        const responseData = {
            title: title,
            username: data.loggedIn.username,
            date: date,
            genre: genre,
            description: description,
            image: image,
            like: 0,
            dislike: 0
        };

        const postInstance = postModel({
            title: title,
            username: data.loggedIn.username,
            date: date,
            genre: genre,
            description: description,
            image: image
        });

        postInstance.save().then(function(login) {
            console.log('Post created');
        }).catch(errorFn);

        console.log(responseData);
        resp.send(responseData);
    });

    server.post('/create_comment', function(req, resp){
        const comment = req.body.comment;
        const postId = req.body.id

        console.log(postId);
        const responseData = {
            user: data.loggedIn.username,
            comment: comment
        };

        const searchQuery = postId;

        postModel.findById(searchQuery).then(function(post){
            
            const commentData = {
                user: data.loggedIn.username,
                text: comment
            }
            post.comments.push(commentData);

            post.save().then(function(instance) {
                console.log('Comment Added');
                console.log(responseData);
                resp.send(responseData);
            }).catch(errorFn);
        });
        

    });

    server.post('/like', function(req, resp){
        const {postId} = req.body;
        console.log(data.loggedIn);
        if(data.loggedIn.username === ''){
            console.log("not logged in, cant like");
        }else{
            const searchPost = {_id: postId};
            postModel.findOne(searchPost).then(function(post){
                const searchUser = {user: data.loggedIn.username};
                console.log("likes: ",post.like);
                const userLiked = post.like.some(like => like.user === searchUser.user);
                if (userLiked) {
                    console.log("Post was already liked by this user");
                    return; // will do a remove user from array if pressed again
                }
                post.like.push(searchUser);
                post.save().then(function(savedPost) {
                    console.log('Post liked by user:', searchUser);
                    const responseData = {
                        likes: savedPost.like.length,
                        post_id: postId
                    };
                    console.log("Response data:",responseData);
                    resp.send(responseData);
                });      
            });
        }
    });

    server.post('/dislike', function(req, resp){
        const {postId} = req.body;
        console.log(data.loggedIn);
        if(data.loggedIn.username === ''){
            console.log("not logged in, cant dislike");
        }else{
            const searchPost = {_id: postId};
            postModel.findOne(searchPost).then(function(post){
                const searchUser = {user: data.loggedIn.username};
                console.log("dislikes: ", post.dislike);
                const userDisliked = post.dislike.some(dislike => dislike.user === searchUser.user);
                if (userDisliked) {
                    console.log("Post was already liked by this user");
                    return; // will do a remove user from array if pressed again
                }
                if (!post.dislike) {
                    post.dislike = []; // If not, initialize it
                }
                post.dislike.push(searchUser);
                post.save().then(function(savedPost) {
                    console.log('Post disliked by user:', searchUser);
                    const responseData = {
                        dislikes: savedPost.dislike.length,
                        post_id: postId
                    };
                    resp.send(responseData);
                });      
            });
        }
    });
}

module.exports.add = add;