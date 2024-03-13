const express = require('express');
const server = express();
const data = require('./data');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fanimeDB');

const userSchema = new mongoose.Schema({
    user: { type: String },
    email: { type: String},
    pass: { type: String },
    profilepicture: { type: String }
  },{ versionKey: false });

const postSchema = new mongoose.Schema({
    username: { type: String },
    date: { type: String},
    title: { type: String },
    genre: { type: String },
    description: { type: String},
    image: { type: String},
    comments: [{
        user: { type: String },
        text: { type: String }
    }],
    like: [{
        user: { type: String}
    }],
    dislike: [{
        user: { type: String}
    }]
},{ versionKey: false });

const userModel = mongoose.model('user', userSchema);
const postModel = mongoose.model('post', postSchema);

function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

const bodyParser = require('body-parser')
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

server.use(express.static('public'));
server.use(express.static('Assets'));

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
        //get all the post titles
        //foreach them
        //check if .includes(search query from search bar) wowowowoowow
        //make a server.post('/search', function...);
        resp.render('unregMain', {
            layout: 'index',
            title: 'Unregistered Page',
            posts: vals
        });
    });
});

server.get('/loginFailed', function(req, resp){
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
        //get all the post titles
        //foreach them
        //check if .includes(search query from search bar) wowowowoowow
        //make a server.post('/search', function...);
        resp.render('unregMain', {
            layout: 'index',
            title: 'Unregistered Page',
            posts: vals,
            msg: 'Wrong Credentials, User does not exist...'
        });
    });
});

server.get('/registerFailed', function(req, resp){
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
        //get all the post titles
        //foreach them
        //check if .includes(search query from search bar) wowowowoowow
        //make a server.post('/search', function...);
        resp.render('unregMain', {
            layout: 'index',
            title: 'Unregistered Page',
            posts: vals,
            msg: 'Email already linked with an Account...'
        });
    });
});

// #fail
// function validateForm(username, email, pass, confirmpass, resp){
//     if (username == "") {
//       return "Name must be filled out!";
//     }
//     if(pass !== confirmpass){
//       return "Passwords must be the same!";
//     }
//     if(pass.length<8){
//       return "Password must be atleast 8 characters long!";
//     }
//     const searchQuery = {email : email};
//     userModel.findOne(searchQuery).then(function(user){
//         console.log(user);
//         if(user){
//             return "You already have an account under that email!";
//         }
//     });
//     return "True";
// }
//
// function checkEmail(user){
//     if(!user){
//         return false;
//     }
//     return true;
// }

function setLogIn(username, email, profile){
    data.loggedIn.username = username;
    data.loggedIn.email = email;
    data.loggedIn.profilepicture = profile;
}

//will fix later loading data json posts
server.post('/register', function(req, resp){
    const userInstance = userModel({
        user: req.body.user,
        email: req.body.email,
        pass: req.body.pass,
        profilepicture: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
    });
    const searchQuery = { email : req.body.email };
    userModel.findOne(searchQuery).then(function(user){
      if(user != undefined && user._id != null){
        resp.redirect('/registerFailed');
        //   resp.render('unregMain',{
        //       layout: 'index',
        //       title: 'Unregistered Page',
        //       posts: data.posts,
        //       msg: 'Email already linked with an Account...'
        //   });
      }else{
        setLogIn(req.body.user, req.body.email);
          userInstance.save().then(function(user) {
              console.log('User created');
              resp.redirect('/main');
             }).catch(errorFn);
       }
    });
});

server.post('/login', function(req, resp){
      const searchQuery = {email : req.body.email, pass: req.body.pass};
      userModel.findOne(searchQuery).then(function(user){
        if(user != undefined && user._id != null){
            setLogIn(user.user, req.body.email, user.profilepicture);
            resp.redirect('/main');
        }else{
            resp.redirect('/loginFailed');
            // resp.render('unregMain',{
            //     layout: 'index',
            //     title: 'Unregistered Page',
            //     posts: data.posts,
            //     msg: 'Wrong Credentials, User does not exist...'
            // });
        }
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

server.post('/search', function(req, resp){
    postModel.find({ "title": { "$regex": req.body.search, "$options": "i" }} ).lean().then(function(posts){
        console.log('Loading posts from database');
        console.log(posts);
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
                    dislike: post.dislike.length
                });
            }

            resp.render('main', {
                layout: 'index',
                title: 'Main Page',
                posts: vals
            });
        });
});

server.get('/profile', function(req, resp){
        let userData = data.users[data.loggedIn.username];   
        let profilePic = userData['profile-pic'] || 'https://wallpapers.com/images/hd/basic-default-pfp-pxi77qv5o0zuz8j3.jpg';
        let profileBanner = userData['profile-banner'] || 'https://wikitravel.org/upload/shared//6/6a/Default_Banner.jpg';
        let userBio = userData['user-bio'] || 'Default bio';
        let favAnime = userData['fav-anime'] || [];
        let favManga = userData['fav-manga'] || [];
        let posts = userData['posts'];
            resp.render('profile', {
                layout: 'profileIndex',
                title: 'Profile Page',
                username: data.loggedIn.username,
                pfp: profilePic,
                banner: profileBanner,
                bio: userBio,
                favAnime: favAnime,
                favManga: favManga,
                posts: posts
            });
});


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

server.get('/genrefilter', function(req, resp){
    const searchQuery = {genre: req.query.topic};
    console.log(searchQuery);
    postModel.find(searchQuery).lean().then(function(posts){
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
                    dislike: post.dislike.length
                });
            }

            if(data.loggedIn.username === ''){
                resp.render('unregMain', {
                layout: 'index',
                title: 'Unregistered Page',
                posts: vals
                });
            }else{
                resp.render('main', {
                    layout: 'index',
                    title: 'Main Page',
                    posts: vals
                    });
            }
            
        });
});

server.get('/postfilter', function(req, resp){
    const searchQuery = req.query.filter;
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
                    dislike: post.dislike.length
                });
            }
            
            if(searchQuery === 'Mosted Liked'){
                vals.sort((a, b) => b.like - a.like);
            }else if(searchQuery === 'Most Discussed'){
                vals.sort((a,b) => b.comments.length - a.comments.length);
            }else if(searchQuery === 'Top Posts'){
                vals.sort((a, b) => (b.comments.length + b.like) - b.dislike - ((a.comments.length + a.like) - a.dislike));
            }else{
                vals.reverse();
            }
            if(data.loggedIn.username === ''){
                resp.render('unregMain', {
                    layout: 'index',
                    title: 'Unregistered Page',
                    posts: vals
                });
            }else{
                resp.render('main', {
                    layout: 'index',
                    title: 'Unregistered Page',
                    posts: vals
                });
            }
      
        });
});

function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands

const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});