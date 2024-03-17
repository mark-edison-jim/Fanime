const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const upload = responder.upload;
const data = require('../data');

function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

function resetLogIn(){
    data.loggedIn.username = '';
    data.loggedIn.email = '';
    data.loggedIn.profilepicture = '';
}

function add(server){
    server.get('/', function(req, resp){
        resetLogIn();
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
                console.log(data.loggedIn.profilepicture);
                resp.render('main', {
                    layout: 'index',
                    title: 'Main Page',
                    posts: vals,
                    loggedprofilepicture: data.loggedIn.profilepicture,
                    loggedusername: data.loggedIn.username
                });
            });
    });

    async function findUserPost(postQuery){
        const posts = await postModel.find(postQuery).lean();
        let userpost = new Array();
                for(const post of posts){
                    userpost.push({
                        _id : post._id.toString(),
                        title: post.title
                    });
                }
                console.log("func", userpost);
                return userpost;

        // postModel.find(postQuery).lean().then(function(posts){//i need to loop through all posts
        //         console.log('Loading User data');
        //         let userpost = new Array();
        //         for(const post of posts){
        //             userpost.push({
        //                 _id : post._id.toString(),
        //                 title: post.title
        //             });
        //         }
        //         console.log("func", userpost);
        //         return userpost;
        //     });
    }

    function setProfilePic(pfp){
        data.loggedIn.profilepicture = pfp;
    }

    server.post('/upload', upload.fields([{ name: 'pfp', maxCount: 1 }, { name: 'profile-banner', maxCount: 8 }]), (req,resp) =>{
        const searchQuery = { email : data.loggedIn.email};
         setProfilePic(req.files['pfp'][0].filename);
        // console.log(req.files['profile-banner'][0].filename)
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
        const searchQuery = {user : data.loggedIn.username};

        userModel.findOne(searchQuery).lean().then(function(account){
            postModel.find({}).lean().then(function(posts){
                console.log(posts)
                const commentArr = new Array();
                for(let i=0; i<posts.length; i++){
                    console.log('post', posts[i])
                    console.log('comments', posts[i].comments)
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
                console.log(commentArr)
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
    //let usercomments = new Array();
    // let userpost = findUserPost(postQuery).then(function(posts){
    //     let arr = new Array;
    //     for(const post of posts){
    //         arr.push({
    //             _id : post._id.toString(),
    //             title: post.title
    //         });
    //     }
    //     console.log(arr);
    //     return arr;
    // });
    // console.log("hi");
    // console.log(userpost);
    // postModel.find({}).lean().then(function(allpost){
    //     for(const post of allpost){
    //         for(const comment of post.comments){
    //             if(post.comments === account.user){
    //                 usercomments.push({
    //                     _id : post._id.toString(),
    //                     title: post.title
    //                 });
    //             }
    //         }
    //     }
        
    // });
    // const userdata = {
    //         username: account.user,
    //         pfp: account.profilepicture,
    //         banner: account.profilebanner,
    //         bio: account.userbio,
    //         favAnime: account.favAnime,
    //         favManga: account.favManga,
    //         posts: userpost,
    //         comments: usercomments,
    //         loggedprofilepicture: account.profilepicture
    //     }
    server.post('/newPost', upload.single('postimg'), function(req,resp){
        // const { title, date, genre, description, image} = req.body;
        const title = req.body['post-title'];
        const date = "5hrs ago";
        const genre = req.body['post-tag'];
        const description = req.body.postDesc;
        const image = req.file.filename;
        
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
                        loggedusername: data.loggedIn.username,
                        loggedprofilepicture: data.loggedIn.profilepicture
                    });
                })
        })
    });

    server.get('/editpost', function(req, resp){
       resp.render('editpost', {
            layout: 'index',
            title: 'Edit Post Page',
            username: data.loggedIn.username,
            pfp: data.loggedIn.profilePic,
            loggedusername: data.loggedIn.username,
            loggedprofilepicture: data.loggedIn.profilepicture
        });
        
    });

    server.get('/editcomment', function(req, resp){
        
        resp.render('editcomment', {
            layout: 'index',
            title: 'Edit Comment Page',
            username: data.loggedIn.username,
            pfp: data.loggedprofilepicture
        });
        
    });

    // server.post('/create_post', function(req, resp){
    //     const { title, date, genre, description, image} = req.body;

    //     const responseData = {
    //         title: title,
    //         username: data.loggedIn.username,
    //         date: date,
    //         genre: genre,
    //         description: description,
    //         image: image,
    //         like: 0,
    //         dislike: 0
    //     };

    //     const postInstance = postModel({
    //         title: title,
    //         username: data.loggedIn.username,
    //         date: date,
    //         genre: genre,
    //         description: description,
    //         image: image
    //     });

    //     postInstance.save().then(function(login) {
    //         console.log('Post created');
    //     }).catch(errorFn);

    //     console.log(responseData);
    //     resp.send(responseData);
    // });

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