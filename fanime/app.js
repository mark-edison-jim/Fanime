const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const server = express();   

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(methodOverride('_method'));
server.use(express.urlencoded({ extended: true }));

const data = require('./data');

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

server.use(express.static('public'));
server.use(express.static('Assets'));


const mongoURI = 'mongodb://localhost:27017/fanimeDB';

const conn = mongoose.createConnection(mongoURI);

const userSchema = new mongoose.Schema({
    user: { type: String },
    email: { type: String},
    pass: { type: String },
    profile_pic: {type: String}
  },{ versionKey: false });

const userModel = conn.model('user', userSchema);

let gfs;
conn.once('open', ()=>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });

function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

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
server.post('/upload', upload.single('profile-pic'), (req,resp) =>{
    // resp.json({ file: req.file });
    const searchQuery = { email : data.loggedIn.email};
    setProfilePic(req.file.filename);
    userModel.findOne(searchQuery).then(function(user) {
        console.log('Update successful');
        user.profile_pic = req.file.filename;
        user.save().then(function (result) {
        //   if(result){
            resp.redirect('/main');
        //   }else{
        //     resp.redirect('/profile');
        //   }
        }).catch(errorFn);
      }).catch(errorFn);
});

const defaultProfPic = 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';

function setLogIn(username, email){
    data.loggedIn.username = username;
    data.loggedIn.email = email;
}

function setProfilePic(profpic){
    data.loggedIn.profile_pic = profpic;
}

server.post('/register', function(req, resp){
    const userInstance = userModel({
        user: req.body.user,
        email: req.body.email,
        pass: req.body.pass,
        profile_pic: "default"
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
        setProfilePic("default");
          userInstance.save().then(function(user) {
              console.log('User created');
              resp.redirect('/main');
             }).catch(errorFn);
       }
    }).catch(errorFn);
});

//continue from here, fix uploading default profile pic
server.post('/login', function(req, resp){
      const searchQuery = {email : req.body.email, pass: req.body.pass};
      userModel.findOne(searchQuery).then(function(user){
        if(user != undefined && user._id != null){
            setLogIn(user.user, req.body.email);
            setProfilePic(user.profile_pic);
            resp.redirect('/main');
        }else{
            resp.render('unregMain',{
                layout: 'index',
                title: 'Main Page',
                posts: data.posts,
                msg: 'Wrong Credentials, User does not exist...'
            });
        }
      }).catch(errorFn);
});

server.get('/main', function(req, resp){
    if(data.loggedIn.profile_pic === "default"){
        resp.render('main',{
            layout: 'index',
            title: 'Main Page',
            username: data.loggedIn.username,
            posts: data.posts,
            profile_pic: defaultProfPic
         });
    }else{
        console.log(data.loggedIn.profile_pic);
        gfs.files.findOne({filename: data.loggedIn.profile_pic}).then((file) => {
        console.log(file);
        if(!file || file.length === 0){
            console.log("test");
            resp.status(404).json({
                err: 'No such file exists'
            });
        }else{
            resp.render('main',{
                layout: 'index',
                title: 'Main Page',
                username: data.loggedIn.username,
                posts: data.posts,
                profile_pic: `image/${file.filename}`
             });
        }
    }).catch(errorFn);
    }
});

async function getFile(filename){
    const file = await gfs.files.findOne({filename : filename});
    return file;    
}

server.get('/image/:filename', (req, resp) => {
    getFile(req.params.filename).then((file)=>{
        if(!file || file.length === 0){
            return resp.status(404).json({
                err: 'No such file exists'
            });
        }
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(resp);
        }else{
            resp.status(404).json({
                err: 'not an image'
            });
        }
    });
});

async function getFiles(){
    const files = await gfs.files.find().toArray();
    return files;
}

server.get('/files', (req, resp) =>{
    getFiles().then((files)=>{
        console.log(files);
        if(!files || files.length === 0){
            return resp.status(404).json({
                err: 'No such file exists'
            });
        }
    
        return resp.json(files);
    });
    
    // gfs.find().toArray().then((err,files)=>{
    //     if(!files || files.length === 0){
    //         return resp.status(404).json({
    //             err: 'No such file exists'
    //         });
    //     }

    //     return resp.json(files);
    // });
});

server.get('/profile', function(req, resp){
    if(data.loggedIn.profile_pic === "default"){
        resp.render('profile', {
            layout: 'profileIndex',
            title: 'Profile Page',
            username: data.loggedIn.username,
            user: data.users.person1,
            profile_pic: defaultProfPic
        });
    }else{
    gfs.files.findOne({filename: data.loggedIn.profile_pic}).then((file) => {
        if(!file || file.length === 0){
            return resp.status(404).json({
                err: 'No such file exists'
            });
        }else{
            resp.render('profile', {
                layout: 'profileIndex',
                title: 'Profile Page',
                username: data.loggedIn.username,
                user: data.users.person1,
                profile_pic: `image/${file.filename}`
            });
        }
    });
}
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