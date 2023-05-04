var admin = require("firebase-admin");
const verifyToken = require('../backend/middlewares/verifyToken');

const { API_KEY } = require("../backend/config.js");
var cred = require("../backend/credentials.json");
const request = require('request');
const fetch = require('node-fetch');

admin.initializeApp({
  credential: admin.credential.cert(cred)
});
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
  origin: "movie-app-full-stack-1.web.app",
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

app.get('/movies', (req, res) => {
  const query = req.query.query;

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

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
      res.status(response.statusCode).send(error.message);
    }
  });
});

app.get('/movie', (req, res) => {
  const Url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
    request(Url, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send('An error occurred');
        } else {
            res.send(body);
        }
    });
});

app.get('/movietrending', async (req, res) => {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US&page=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Export the Express app as an HTTP function
exports.app = functions.https.onRequest(app);
