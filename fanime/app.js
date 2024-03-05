const express = require('express');
const server = express();
const data = require('./data');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fanimeDB');

const userSchema = new mongoose.Schema({
    user: { type: String },
    email: { type: String},
    pass: { type: String }
  },{ versionKey: false });

const userModel = mongoose.model('user', userSchema);
const postModel = mongoose.model('post', userSchema);

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
    resp.render('unregMain', {
        layout: 'index',
        title: 'Unregistered Page',
        posts: data.posts
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

function setLogIn(username, email){
    data.loggedIn.username = username;
    data.loggedIn.email = email;
}

server.post('/register', function(req, resp){
    const userInstance = userModel({
        user: req.body.user,
        email: req.body.email,
        pass: req.body.pass
    });
    const searchQuery = { email : req.body.email };
    userModel.findOne(searchQuery).then(function(user){
      if(user != undefined && user._id != null){
          resp.render('unregMain',{
              layout: 'index',
              title: 'Main Page',
              posts: data.posts,
              msg: 'Email already linked with an Account...'
          });
      }else{
        setLogIn(req.body.user, req.body.email);
          userInstance.save().then(function(user) {
              console.log('User created');
              resp.render('main',{
                  layout: 'index',
                  title: 'Main Page',
                  username: req.body.user,
                  posts: data.posts
               });
             }).catch(errorFn);
       }
    });
});

server.post('/login', function(req, resp){
      const searchQuery = {email : req.body.email, pass: req.body.pass};
      userModel.findOne(searchQuery).then(function(user){
        if(user != undefined && user._id != null){
            setLogIn(user.user, req.body.email);
            resp.render('main',{
                layout: 'index',
                title: 'Main Page',
                username: user.user,
                posts: data.posts
            });
        }else{
            resp.render('unregMain',{
                layout: 'index',
                title: 'Main Page',
                posts: data.posts,
                msg: 'Wrong Credentials, User does not exist...'
            });
        }
      });
});

server.get('/profile', function(req, resp){
    resp.render('profile', {
        layout: 'profileIndex',
        title: 'Profile Page',
        username: data.loggedIn.username,
        user: data.users.person1
    });
});

server.get('/post/:id/', function(req, resp){
    resp.render('post', {
        layout: 'index',
        title: 'Post Page',
        post: data.posts[req.params.id]
    });
    
});

server.get('/editpost', function(req, resp){
    resp.render('editpost', {
        layout: 'index',
        title: 'Edit Post Page'
    });
    
});

server.get('/editcomment', function(req, resp){
    resp.render('editcomment', {
        layout: 'index',
        title: 'Edit Comment Page'
    });
    
});

server.post('/create_post', function(req, resp){
    const {title, genre, description} = req.body;

    const responseData = {
        title: title,
        genre: genre,
        description: description
    };
    console.log(responseData);
    resp.send(responseData);
});

function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands

const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});