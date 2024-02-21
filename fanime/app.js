const express = require('express');
const server = express();

//Add needed statements
const data = require('./data');

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
    resp.render('main', {
        layout: 'index',
        title: 'Main Page',
        posts: data.posts
    });
});

server.get('/profile', function(req, resp){
    resp.render('profile', {
        layout: 'profileIndex',
        title: 'Profile Page',
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

const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});