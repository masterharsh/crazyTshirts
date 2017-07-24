/////////////////////////////////////////////////////////////////////////////
///////////Code By: Harsh Jain 22-07-2017////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


//Create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'freshdb'
});

//Connect
db.connect((err) =>{
   if(err){
       throw err;
   } 
    console.log('MySql Connected..');
});

const app = express();

// Body Parser Middleware
app.use(bodyParser.json()); 

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.redirect('/index.html');
});

// Insert post
app.post('/addpost1',(req,res) =>{
   let posted = req.body;
   let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql,posted, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send('Post 1 added..');
    });
});

// Select all posts
app.get('/getposts',(req,res) =>{  
   let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) =>{
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});

// Select post
app.get('/getpost/:title',(req,res) =>{
  
   let sql = `SELECT * FROM posts WHERE title = "${req.params.title}"`;
    let query = db.query(sql, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});


app.listen('8080',()=>{
    console.log('Server started on port 8080');    
});