const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fanimeDB');
const multer  = require('multer');
const path = require('path');
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './Images')
    },
    filename: (req, file, cb) =>{
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    } 
})

const upload = multer({storage: storage});

const userSchema = new mongoose.Schema({
    user: { type: String },
    email: { type: String},
    pass: { type: String },
    profilepicture: { type: String },
    profilebanner: { type: String},
    userbio: { type: String },
    favAnime: [{
        animeIcon: {type: String},
        animeTitle: {type: String}
    }],
    favManga: [{
        mangaIcon: {type: String},
        mangaTitle: {type: String}
    }]
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

const imgPath = '../Images/';

const userModel = mongoose.model('user', userSchema);
const postModel = mongoose.model('post', postSchema);
const sessionModel = mongoose.connection.collection("mySession");

module.exports.userModel = userModel;
module.exports.postModel = postModel;
module.exports.sessionModel = sessionModel;
module.exports.session = session;
module.exports.mongoStore = mongoStore;
module.exports.upload = upload;
module.exports.imgPath = imgPath;