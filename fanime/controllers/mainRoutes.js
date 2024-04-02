const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const upload = responder.upload;
const data = require('../data');
const session = responder.session;
const mongoStore = responder.mongoStore;

function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

function add(server){
    server.get('/', function(req, resp){
        if(req.session.login_user_id == undefined){
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
                        posts: vals,
                        msg: 'Welcome to Fanime! Login or Sign Up to view/filter Posts!'
                    });
                });
        }else{
            resp.redirect('/main');
        }
    });

    server.get('/main', function(req, resp){
        if(req.session.login_user_id == undefined){
            resp.redirect('/logout');
            return;
        }else{
            postModel.find({}).lean().then(function(posts){
                console.log('Loading posts from database');
                let vals = new Array();
                    for(const post of posts){
                        const searchQuery = {user: post.username};
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
                    console.log(req.session.profilepicture);
                    resp.render('main', {
                        layout: 'index',
                        title: 'Main Page',
                        posts: vals,
                        loggedprofilepicture: req.session.profilepicture,
                        loggedusername: req.session.username
                    });
                });
            }
    });

    server.post('/upload', upload.fields([{ name: 'pfp', maxCount: 1 }, { name: 'profile-banner', maxCount: 8 }]), (req,resp) =>{
        const searchQuery = { email : req.session.email};
        req.session.profilepicture = req.files['pfp'][0].filename;
        userModel.findOne(searchQuery).then(function(user) {
            console.log('Update successful');
            user.profilepicture = req.files['pfp'][0].filename;
            user.profilebanner = req.files['profile-banner'][0].filename;
            user.save().then(function (result) {
                resp.redirect('/profile');
            }).catch(errorFn);
        }).catch(errorFn);
    })

    server.get('/profile', function(req, resp){
        const searchQuery = {user : req.session.username};

        userModel.findOne(searchQuery).lean().then(function(account){
            postModel.find({}).lean().then(function(posts){
                const commentArr = new Array();
                for(let i=0; i<posts.length; i++){
                    // console.log('post', posts[i])
                    // console.log('comments', posts[i].comments)
                    for(let j=0; j<posts[i].comments.length; j++){
                        if(posts[i].comments[j].user === account.user){
                            commentArr.push({
                                _id : posts[i]._id.toString(),
                                title: posts[i].title
                            })
                        }
                    }
                }
                const postsArr = new Array();
                for(let i=0; i<posts.length; i++){
                    if(posts[i].username === account.user)
                        postsArr.push(posts[i]);
                }
                const userdata = {
                    username: account.user,
                    pfp: account.profilepicture,
                    banner: account.profilebanner,
                    bio: account.userbio,
                    favAnime: account.favAnime,
                    favManga: account.favManga,
                    posts: postsArr,
                    comments: commentArr,
                    loggedprofilepicture: account.profilepicture
                } 
                console.log(account.profilepicture)
                resp.render('profile', {
                    layout: 'profileIndex',
                    title: 'Profile Page',
                    account: userdata
                });    
            });
        });

    });

    server.post('/newPost', upload.single('postimg'), function(req,resp){
        // const { title, date, genre, description, image} = req.body;
        const title = req.body['post-title'];
        const date = "5hrs ago";
        const genre = req.body['post-tag'];
        const description = req.body.postDesc;
        const image = req.file.filename;
        
        const postInstance = postModel({
            title: title,
            username: req.session.username,
            date: date,
            genre: genre,
            description: description,
            image: image
        });

        postInstance.save().then(function(login) {
            console.log('Post created');
            resp.redirect('/main');
        }).catch(errorFn);
    });

    server.get('/post', function(req, resp){
        const searchQuery = req.query.post_id;
        postModel.findById(searchQuery).lean().then(function(post){
            const searchQuery = {user: post.username};
                userModel.findOne(searchQuery).lean().then(function(account){
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
                    dislike: post.dislike.length,
                    profilepicture: account.profilepicture
                    };
                    console.log(account.profilepicture)
                    resp.render('post', {
                        layout: 'index',
                        title: 'Post Page',
                        post: post_data,
                        loggedusername: req.session.username,
                        loggedprofilepicture: req.session.profilepicture
                    });
                })
        })
    });

    server.get('/editpost', function(req, resp){
        const searchQuery = req.query.post_id;
        console.log("Search Query", searchQuery);
        postModel.findById(searchQuery).lean().then(function(postInstance){
            const data = {
                title: postInstance.title,
                description: postInstance.description,
                image: postInstance.image,
                genre: postInstance.genre
            }
            console.log(data);
            resp.render('editpost', {
                layout: 'index',
                title: 'Edit Post Page',
                post: data,
                username: req.session.username,
                pfp: req.session.profilePic,
                loggedusername: req.session.username,
                loggedprofilepicture: req.session.profilepicture
            });
        }).catch(errorFn);
        
    });

    server.get('/editcomment', function(req, resp){
        
        resp.render('editcomment', {
            layout: 'index',
            title: 'Edit Comment Page',
            username: req.session.username,
            pfp: req.session.profilepicture
        });
        
    });

    server.post('/create_comment', function(req, resp){
        const comment = req.body.comment;
        const postId = req.body.id

        console.log(postId);
        const responseData = {
            user: req.session.username,
            comment: comment
        };

        const searchQuery = postId;

        postModel.findById(searchQuery).then(function(post){
            
            const commentData = {
                user: req.session.username,
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
        if(req.session.username === ''){
            console.log("not logged in, cant like");
        }else{
            const searchPost = {_id: postId};
            postModel.findOne(searchPost).then(function(post){
                const searchUser = {user: req.session.username};
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
        if(req.session.username === ''){
            console.log("not logged in, cant dislike");
        }else{
            const searchPost = {_id: postId};
            postModel.findOne(searchPost).then(function(post){
                const searchUser = {user: req.session.username};
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