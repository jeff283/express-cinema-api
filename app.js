const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

//Create connection
//Add your database credentials
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : process.env.PASSWORD
    ,database : "cinema_db" 
});

//Connect to database
db.connect((err) => {
    if(err) throw err;
    console.log("MySql Connected");
});



//init express
const app = express();

//enable json parsing
app.use(express.json());

//enabling Cross-Origin Resource Sharing
app.use(cors());

//home route
app.get('/', (req, res) => {
    res.status(200).send({message : 'Welcome to the Cinema JS api'});
});

//get all movies
app.get('/api/movies', (req,res)=>{
    let sql = "SELECT * FROM movie";
    
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).send(results);
    })
});

//get one movie
app.get('/api/movies/:id', (req, res) => {
    let movie_ID = req.params.id;
    let sql = `SELECT * FROM movie WHERE movie_ID = ${movie_ID}`;
    
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).send(results);
    })
});


//get all showtimes
app.get('/api/showtimes', (req,res)=>{
    let sql = "SELECT showtime.showtime_ID, showtime.movie_ID, showtime.time, showtime.location, movie.title FROM showtime LEFT JOIN movie ON showtime.movie_ID=movie.movie_ID ORDER BY showtime.time DESC;";
    
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).send(results);
    })
});

//get one showtime
app.get('/api/showtimes/:id', (req, res) => {
    let showtime_ID = req.params.id;
    let sql = `SELECT * FROM showtime WHERE showtime_ID = ${showtime_ID}`;
    
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).send(results);
    })
});


//add showtime
app.post('/api/showtimes', (req, res) => {
    let showtime = { 
        movie_ID : req.body.movie_ID,
        time : req.body.time,
        location : req.body.location 
    };
    sql = `insert into showtime (movie_ID, time, location) values (${showtime.movie_ID}, '${showtime.time}', '${showtime.location}')`;

    db.query(sql, (err, results) => {
        if(err) throw err;
        console.log("showtime records created");
        showtime.showtime_ID = results.insertId;
        console.log(showtime);
        res.status(201).send(showtime);
    });


});

//Update showtime
app.put('/api/showtimes/:id', (req, res) =>{
    const showtime = {
        showtime_ID : parseInt(req.params.id), 
        movie_ID : req.body.movie_ID,
        time : req.body.time,
        location : req.body.location 
    };

   let sql = `UPDATE showtime SET movie_ID = ${showtime.movie_ID}, time = '${showtime.time}', location = '${showtime.location}' WHERE showtime_ID = ${showtime.showtime_ID}`;
   db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Showtime record updated');
        res.status(200).send(showtime);

   });

});

//Deleting a showtime record
app.delete('/api/showtimes/:id', (req, res) => {

    let sql = `DELETE FROM showtime WHERE showtime_ID = ${parseInt(req.params.id)}`;
    db.query(sql, (err, results) => {
        if(err) throw err;
        console.log("Show time deleted");
        res.status(200).send({message : 'deleted ' + results.affectedRows + ' rows'});
    })

});

//get all showtimes and their movies
app.get('/api/shows', (req, res) => {
    let sql = "SELECT showtime.showtime_ID, showtime.movie_ID, showtime.time, showtime.location, movie.title, movie.genre, movie.rating, movie.description FROM showtime LEFT JOIN movie ON showtime.movie_ID=movie.movie_ID ORDER BY showtime.time DESC";

    db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).send(results);
    })
    console.log("GET: /api/shows");
});


const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}....`));




























