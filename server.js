const bcrypt = require('bcrypt');
const http = require('http');
const express = require('express'), bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'hackYeah',
    password: 'qWERTYUIOP123!',
});

app.get('/leaderboard', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT user_login, user_points FROM hackyeah.users ORDER BY `users`.`user_points` ASC');
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
        await conn.end();
    }
    catch(e){

    }
});

app.get('/settings', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT user_login, user_password FROM hackyeah.users');
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
        await conn.end();
    }
    catch(e){
        console.log('Settings',e);
    }
});


app.get('/questions', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT day, question, answer_a, answer_b, answer_c, solution FROM hackyeah.questions');
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
        await conn.end();
    }
    catch(e){

    }
});

app.get('/posts', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT post_id ,user_id, post_text, post_date, post_type FROM hackyeah.posts');
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
        await conn.end();
    }
    catch(e){

    }
});

app.get('/comments', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT post_id, user_id, comment_date, comment_text FROM hackyeah.comments');
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
        await conn.end();
    }
    catch(e){

    }
});

app.get('/users', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT user_id, user_login FROM hackyeah.users');
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(jsonS);
        await conn.end();
    }
    catch(e){

    }
});



app.post('/register', async function(req,res) {
    let conn;
    try {
	conn =  await pool.getConnection();
        const {user_login, user_email, user_password} = req.body;
        console.log(req.body);
        const condition1 = await conn.query('SELECT user_login FROM hackyeah.users WHERE user_login=?', user_login);
        const condition2 = await conn.query('SELECT user_email FROM hackyeah.users WHERE user_email=?', user_email);
        if(condition1==[] && condition2==[]){
            const sqlQuery = 'INSERT INTO hackyeah.users (user_login, user_email, user_password, user_points) VALUES (?,?,?,0)';
            rows = await conn.query(sqlQuery, [user_login, user_email, user_password]);
            res.status(200).send('User created');
        }
        else{
            res.status(200).send('User with that login/email already exist');
        }
        await conn.end();
    } catch (e) {
	    console.log(e);
    }
});

app.post('/login', async function(req,res) {
    let conn;
    try {
	    conn =  await pool.getConnection();
        const {user_email,user_password} = req.body;

        const sqlGetUser = 'SELECT user_password FROM hackyeah.users WHERE user_email=?';
        const rows = await pool.query(sqlGetUser,user_email);
        console.log('!!!!!!!!!!!!!!!', rows)
        console.log('!!!!!!!!!!!!!!!', '.' + user_password + '.')
        console.log('!!!!!!!!!!!!!!!', '.' + rows[0].user_password + '.')

        if(rows){
            const isValid = user_password === rows[0].user_password;
            res.status(200).json({valid_password: isValid});
        }
        else{
            res.status(200).send(`User with id ${user_password} was not found`);
        }
        await conn.end();
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/addpost', async function(req,res) {
    let conn;
    try {
	    conn =  await pool.getConnection();
        const {user_id, post_text, post_date, post_type} = req.body;
        console.log(req.body);
	    const encryptedPassword = await bcrypt.hash(user_password,10);
        const sqlQuery = 'INSERT INTO hackyeah.posts (user_id, post_text, post_date, post_type) VALUES (?,?,?,?)';
        rows = await conn.query(sqlQuery, [user_id, post_text, post_date, post_type]);
        // console.log(rows);
        await conn.end();
    } catch (e) {
	    console.log(e);
    }
});

app.post('/addcomment', async function(req,res) {
    let conn;
    try {
	    conn =  await pool.getConnection();
        const {post_id, user_id, comment_date, comment_text} = req.body;
        console.log(req.body);
	    const encryptedPassword = await bcrypt.hash(user_password,10);
        const sqlQuery = 'INSERT INTO hackyeah.comments (post_id, user_id, comment_date, comment_text) VALUES (?,?,?,?)';
        rows = await conn.query(sqlQuery, [post_id, user_id, comment_date, comment_text]);
        // console.log(rows);
        await conn.end();
    } catch (e) {
	    console.log(e);
    }
});






http.createServer(app).listen(2000, ()=>{
    console.log('Express Server started 2000');
});
