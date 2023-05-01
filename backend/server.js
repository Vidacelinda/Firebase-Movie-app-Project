
var admin = require("firebase-admin");
const verifyToken = require('./middlewares/verifyToken');

const { API_KEY } = require("./config.js");


var cred = require("./credentials.json");
const request = require('request');
// including fetch for home top 5 movies api request 
const fetch = require('node-fetch');

admin.initializeApp({
  credential: admin.credential.cert(cred)
});
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
  origin: "http://localhost:5002",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept"
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON request bodies


app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error again');
});
app.use(express.static('public'));

//search funcitonality 
app.get('/movies', (req, res) => {
  
  const query = req.query.query; 

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=1&include_adult=false`;

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      if (data.results.length > 0) {
        const movie = data.results[0];
        const movieData = {
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        };
        res.send(movieData);
      } else {
        res.status(404).send('No movie found.');
      }
    } else {
      res.status(response.statusCode).send(error);
    }
  });
});


//top 5 movies on home page 
app.get('/api/top-rated-movies', async (req, res) => {
  const Url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
  try {
    const response = await fetch(Url);
    const data = await response.json();
    const movies = data.results.slice(0, 5);
    res.send(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});