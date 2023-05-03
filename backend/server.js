
var admin = require("firebase-admin");
const verifyToken = require('./middlewares/verifyToken');

const { API_KEY } = require("./config.js");
// const firebase = require("firebase");

var cred = require("./credentials.json");
const request = require('request');
// including fetch for home top 5 movies api request 
const fetch = require('node-fetch');
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
  origin: "https://movie-app-full-stack-1.web.app",
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


// Swagger Annotation for the `/protected` endpoint
/**
* GET request to a protected endpoint that requires a valid JSON web token 
* to be passed in the Authorization header.
* @function GET_Method_VerifyToken
* @name getProtectedEndpoint
* @param {object} req - The HTTP request object.
* @param {object} req.user - The user object extracted from the JSON web 
* token.
* @param {object} res - The HTTP response object.
* @returns {object} - The response object with a status code and JSON data  
* containing a message and user information.
* @throws {Error} - If the JSON web token is invalid or not provided, an 
* error is thrown.
*/

app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error again');
});


// Swagger Annotation for the `/movies` endpoint
/**
 * Get movie data for a given search query.
 *
 * @function GET_Method_SearchMovie
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {string} req.query.query - The search query string.
 *
 * @throws {Error} - If there's an error while fetching data from the API.
 */
//search funcitonality 
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

/**
 * Get the list of top rated movies.
 *
 * @function GET_Method_TopRatedMovies
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Error} - If there's an error while fetching data from the API.
 */
//API endpoint that retrieves the top rated movies
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

/**
 * Get the list of trending movies and TV shows.
 *
 * @function GET_Method_TrendingMovies
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - The response is sent back in JSON format.
 *
 * @throws {Error} - If there's an error while fetching data from the API.
 */
//trending
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


