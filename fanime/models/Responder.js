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

module.exports.userModel = userModel;
module.exports.postModel = postModel;