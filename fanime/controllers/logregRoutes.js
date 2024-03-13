const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const data = require('../data');

function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

function add(server){
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
            resp.render('unregMain', {
                layout: 'index',
                title: 'Unregistered Page',
                posts: vals,
                msg: 'Email already linked with an Account...'
            });
        });
    });

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
}

module.exports.add = add;