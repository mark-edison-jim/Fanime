const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const sessionModel = responder.sessionModel;
const session = responder.session;
const mongoStore = responder.mongoStore;
const data = require('../data');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

function add(server){
    server.use(session({
        secret: 'i was today years old when i found out fanime stood for forum anime',
        saveUninitialized: true, 
        resave: false,
        store: new mongoStore({ 
          uri: 'mongodb://localhost:27017/fanimeDB',
          collection: 'mySession',
          expires: 1000*60*60*24 // 1 day
        })
      }));
      
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

    // function setLogIn(username, email, profile){
    //     data.loggedIn.username = username;
    //     data.loggedIn.email = email;
    //     data.loggedIn.profilepicture = profile;
    // }

    //will fix later loading data json posts
    server.post('/register', function(req, resp){
        const searchQuery = { email : req.body.email };
        userModel.findOne(searchQuery).then(function(user){
        if(user != undefined && user._id != null){
            resp.redirect('/registerFailed');
        }else{
            bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
                let encrypted_pass = String(hash);
                console.log("Encrypted pass: "+encrypted_pass);
                const userInstance = userModel({
                    user: req.body.user,
                    email: req.body.email,
                    pass: encrypted_pass,
                    profilepicture: 'defaultpfp.jpg',
                    profilebanner : 'defaultbanner.jpg',
                    userbio : 'Feel free to write your bio here!'
                });
                // setLogIn(req.body.user, req.body.email, userInstance.profilepicture);
                userInstance.save().then(function(user) {
                    req.session.login_user_id = user._id;
                    req.session.username = req.body.user;
                    req.session.email = req.body.email;
                    req.session.profilepicture = userInstance.profilepicture;
                    req.session.login_id = req.sessionID;
                    console.log('User created');
                    console.log(JSON.stringify(req.session));
                    resp.redirect('/main');
                    }).catch(errorFn);
                })
            };
        });
    });

    function updateSession(req){
        const newDate = new Date(Date.now() + 1000*60*60*24*7); //1 week
        console.log(req.sessionID)
        sessionModel.findOneAndUpdate({_id : req.session.login_id}, {$set: {expires: newDate}}).then(function(result){
            console.log(result) 
        }).catch(errorFn);
    }

    server.post('/login', function(req, resp){
        const searchQuery = {email : req.body.email};
        userModel.findOne(searchQuery).then(function(user){
            if(user != undefined && user._id != null){
                bcrypt.compare(req.body.pass, user.pass, function(err, result) {
                    if(result){
                        req.session.login_user_id = user._id;
                        req.session.username = user.user;
                        req.session.email = req.body.email;
                        req.session.profilepicture = user.profilepicture;
                        req.session.login_id = req.sessionID;
                        if(req.body.remember){
                            setTimeout(()=>updateSession(req), 5000); //delay for session user info to be inserted before updating expire date
                            resp.redirect('/main');
                        }else{
                            resp.redirect('/main');
                        }
                        // setLogIn(user.user, req.body.email, user.profilepicture);
                    }else{
                        resp.redirect('/loginFailed');
                    }
                });
            }else{
                resp.redirect('/loginFailed');
            }
        });
    });

    server.get('/logout', function(req, resp){
        req.session.destroy(function(err) {
            resp.redirect('/');
        });
    });
}

module.exports.add = add;