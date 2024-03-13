const responder = require('../models/Responder');
const userModel = responder.userModel;
const postModel = responder.postModel;
const data = require('../data');

function add(server){
    server.post('/search', function(req, resp){
        postModel.find({ "title": { "$regex": req.body.search, "$options": "i" }} ).lean().then(function(posts){
            console.log('Loading posts from database');
            console.log(posts);
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
                        posts: vals,
                        loggedprofilepicture: data.loggedIn.profilepicture
                    });
                }
            });
    });

    server.get('/genrefilter', function(req, resp){
        const searchQuery = {genre: req.query.topic};
        console.log(searchQuery);
        postModel.find(searchQuery).lean().then(function(posts){
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
                        posts: vals,
                        loggedprofilepicture: data.loggedIn.profilepicture
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
                        title: 'Main Page',
                        posts: vals,
                        loggedprofilepicture: data.loggedIn.profilepicture
                    });
                }
            });
    });
}

module.exports.add = add;