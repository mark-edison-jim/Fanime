const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const upload = responder.upload;
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
                        profilepicture: post.userpfp
                    })
                }
                    resp.render('unregMain', {
                        layout: 'index',
                        title: 'Fanime',
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
                                profilepicture: post.userpfp
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

    server.post('/upload', upload.fields([{ name: 'pfp', maxCount: 1 },
                                        { name: 'profile-banner', maxCount: 1 },
                                        { name: 'favAnime-img', maxCount: 1 },
                                        { name: 'favManga-img', maxCount: 1 }]), (req,resp) =>{
        const searchQuery = { email : req.session.email};
        req.session.profilepicture = req.files['pfp'] ? req.files['pfp'][0].filename : req.session.profilepicture;
        console.log("files: ", req.files)
        userModel.findOne(searchQuery).then(function(user) {
            const pfp = req.files['pfp'] ? req.files['pfp'][0].filename : user.profilepicture;
            const profban = req.files['profile-banner'] ? req.files['profile-banner'][0].filename : user.profilebanner;
            const profFavAnime = req.files['favAnime-img'] ? req.files['favAnime-img'][0].filename : user.favAnime.animeIcon;
            const profFavManga = req.files['favManga-img'] ? req.files['favManga-img'][0].filename : user.favManga.mangaIcon;
            user.profilepicture = pfp;
            user.profilebanner = profban;
            user.favAnime.animeIcon = profFavAnime;
            user.favManga.mangaIcon = profFavManga;
            user.save().then(function (result) {
                postModel.updateMany(searchQuery, { $set: { username: user.username }, $set: { userpfp: pfp }}).lean().then(function(doc){
                    postModel.find(searchQuery).lean().then(function(posts){
                        console.log('Update successful');
                        console.log("posts: ", posts)
                        resp.redirect('/profile');
                    })
                })
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
                                _idcomment : posts[i].comments[j]._id.toString(),
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
                console.log("favAnime", account.favAnime, "favManga", account.favManga)
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
            userpfp: req.session.profilepicture,
            email: req.session.email,
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
        //profile edit button
        const searchQuery = req.query.post_id;
        console.log("This is editpost Search Query", searchQuery);
        postModel.findById(searchQuery).lean().then(function(postInstance){
            const data = {
                id: postInstance._id,
                title: postInstance.title,
                description: postInstance.description
            }
            console.log(data);
            resp.render('editpost', {
                layout: 'index',
                title: 'Edit Post Page',
                post: data,
                username: req.session.username,
                pfp: req.session.profilepicture,
                loggedusername: req.session.username,
                loggedprofilepicture: req.session.profilepicture
            });
            console.log('hi');
        }).catch(errorFn);
        
    });

    server.post('/submit_edit_post', function(req, resp){
        const searchQuery = req.body.editBtn;
        const title = req.body['post-title'];
        const description = req.body.postDesc;
        console.log(title,description);
        console.log("Editing the Search Query", searchQuery);
        postModel.findById(searchQuery).then(function(postInstance){
            console.log("Post Instance", postInstance);
            postInstance.title = title;
            postInstance.description = description;
            postInstance.save().then(function(){
                resp.redirect("/profile");
            })
        }).catch(errorFn);
    });

    server.get('/delete_post',function(req, resp){
        searchQuery = req.query.post_id;
        postModel.deleteOne({_id: searchQuery}).then(function(){
            resp.redirect('/profile');
        }).catch(errorFn);
    });
    
    server.get('/editcomment', function(req, resp){
        const searchPost = req.query.post_id;
        const searchComment = req.query.comment_id;
        console.log("This is Search Post", searchPost);
        console.log("This is Search Query", searchComment);
        postModel.findById(searchPost).lean().then(function(postInstance){
            const index = postInstance.comments.findIndex(comment => comment._id.toString() === searchComment);
            
            const data = {
                id: postInstance._id,
                idcomment: searchComment,
                comment: postInstance.comments[index].text
            }
            console.log(data);
            resp.render('editcomment', {
                layout: 'index',
                title: 'Edit Comment Page',
                comment: data,
                username: req.session.username,
                pfp: req.session.profilepicture,
                loggedusername: req.session.username,
                loggedprofilepicture: req.session.profilepicture
            });
        }).catch(errorFn);
        
    });
    
    server.post('/submit_edit_comment', function(req, resp){
        const searchPost = req.body['post-id'];
        const searchQuery = req.body['editBtn'];
        const text = req.body['comment-text'];
        console.log(searchPost, searchQuery, text);

        console.log("Editing the Search Query", searchQuery);
        postModel.findById(searchPost).then(function(postInstance){

            const index = postInstance.comments.findIndex(comment => comment._id.toString() === searchQuery);
            postInstance.comments[index].text = text;
            postInstance.save().then(function(){
                resp.redirect("/profile");
            })
        }).catch(errorFn);
    });

    server.get('/delete_comment',function(req, resp){
        searchComment = req.query.comment_id;
        searchPost = req.query.post_id;
        postModel.findById(searchPost).then(function(post){
            const index = post.comments.findIndex(comment => comment._id.toString() === searchComment);
            post.comments.splice(index, 1);
            post.save().then(function(){
                resp.redirect('/profile');
            });
        }).catch(errorFn);
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
        console.log(req.session);
        if(req.session.username === ''){
            console.log("not logged in, cant like");
        }else{
            const searchPost = {_id: postId};
            postModel.findOne(searchPost).then(function(post){
                const searchUser = {user: req.session.username};
                console.log("likes: ",post.like);
                const userLiked = post.like.some(like => like.user === searchUser.user);
                const userDisliked = post.dislike.some(dislike => dislike.user === searchUser.user);
                if (userLiked) {
                    console.log("Post was already liked by this user");
                    const userLikedIndex = post.like.findIndex(like => like.user === searchUser.user);
                    post.like.splice(userLikedIndex, 1);
                    post.save().then(function(savedPost) {
                        console.log('Post unliked by user:', searchUser);
                        const responseData = {
                            likes: savedPost.like.length,
                            dislikes: savedPost.dislike.length,
                            post_id: postId
                        };
                        console.log("Response data:", responseData);
                        resp.send(responseData);
                    });

                } else if (userDisliked) {
                    console.log("Changing dislike to like");
                    const userDislikedIndex = post.dislike.findIndex(dislike => dislike.user === searchUser.user);
                    post.dislike.splice(userDislikedIndex, 1);
                    post.like.push(searchUser);
                    post.save().then(function(savedPost) {
                        const responseData = {
                            likes: savedPost.like.length,
                            dislikes: savedPost.dislike.length,
                            post_id: postId
                        };
                        console.log("Response data:", responseData);
                        resp.send(responseData);
                    });
                }else{
                    post.like.push(searchUser);
                    post.save().then(function(savedPost) {
                        console.log('Post liked by user:', searchUser);
                        const responseData = {
                            likes: savedPost.like.length,
                            dislikes: savedPost.dislike.length,
                            post_id: postId
                        };
                        console.log("Response data:",responseData);
                        resp.send(responseData);
                    });       
                }  
            });
        }
    });

    server.post('/dislike', function(req, resp){
        const {postId} = req.body;
        console.log(req.session);
        if(req.session.username === ''){
            console.log("not logged in, cant dislike");
        }else{
            const searchPost = {_id: postId};
            postModel.findOne(searchPost).then(function(post){
                const searchUser = {user: req.session.username};
                console.log("dislikes: ", post.dislike);
                const userLiked = post.like.some(like => like.user === searchUser.user);
                const userDisliked = post.dislike.some(dislike => dislike.user === searchUser.user);
                if (userDisliked) {
                    console.log("Post was already disliked by this user");
                    const userDislikedIndex = post.dislike.findIndex(dislike => dislike.user === searchUser.user);
                    post.dislike.splice(userDislikedIndex, 1);
                    post.save().then(function(savedPost) {
                        console.log('Post unliked by user:', searchUser);
                        const responseData = {
                            dislikes: savedPost.dislike.length,
                            post_id: postId
                        };
                        console.log("Response data:", responseData);
                        resp.send(responseData);
                    });
                } else if (userLiked) {
                    console.log("Changing like to dislike");
                    const userLikedIndex = post.like.findIndex(like => like.user === searchUser.user);
                    post.like.splice(userLikedIndex, 1);
                    post.dislike.push(searchUser);
                    post.save().then(function(savedPost) {
                        const responseData = {
                            likes: savedPost.like.length,
                            dislikes: savedPost.dislike.length,
                            post_id: postId
                        };
                        console.log("Response data:", responseData);
                        resp.send(responseData);
                    });
                }else{
                    post.dislike.push(searchUser);
                    post.save().then(function(savedPost) {
                        console.log('Post disliked by user:', searchUser);
                        const responseData = {
                            likes: savedPost.like.length,
                            dislikes: savedPost.dislike.length,
                            post_id: postId
                        };
                        resp.send(responseData);
                    });   
                }

                   
            });
        }
    });
}

module.exports.add = add;