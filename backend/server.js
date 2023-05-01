var admin = require("firebase-admin");
const verifyToken = require('./middlewares/verifyToken');

const { API_KEY } = require("./config.js");
// const firebase = require("firebase");

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
  origin: "http://localhost:5000",
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
 * @swagger
 * /protected:
 *   get:
 *     description: Returns a message for a user who has authenticated successfully
 *     responses:
 *       200:
 *         description: Access granted to protected route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access granted to protected route
 *                 user:
 *                   type: object
 *                   example: { userId: 123, email: 'test@test.com' }
 *                   description: An object representing the user who authenticated
 *     security:
 *       - BearerAuth: []
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
 * @swagger
 * /movies:
 *   get:
 *     description: Returns a movie searched by the query parameter
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie name to search for
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: The Shawshank Redemption
 *                   description: The movie's title
 *                 overview:
 *                   type: string
 *                   example: Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.
 *                   description: A brief summary of the movie's plot
 *                 release_date:
 *                   type: string
 *                   example: 1994-09-23
 *                   description: The date when the movie was released
 *                 poster_path:
 *                   type: string
 *                   example: https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg
 *                   description: The URL of the movie's poster image
 *       404:
 *         description: No movie found for the given query
 *       500:
 *         description: Internal server error occurred
 */

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
 * @swagger
 * /api/top-rated-movies:
 *   get:
 *     summary: Get top rated movies
 *     description: Retrieve a list of top rated movies.
 *     responses:
 *       200:
 *         description: A list of top rated movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the movie.
 *                   overview:
 *                     type: string
 *                     description: A brief overview of the movie.
 *                   release_date:
 *                     type: string
 *                     description: The release date of the movie.
 *                   poster_path:
 *                     type: string
 *                     description: The URL of the poster image for the movie.
 *     produces:
 *       - application/json
 */

app.get('/api/top-rated-movies', async (req, res) => {
  const Url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
  try {
    const response = await fetch(Url);
    const data = await response.json();
    const movies = data.results.slice(0, 7);
    res.send(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

/**
 * @swagger
 * /api/trending:
 *   get:
 *     summary: Returns the list of trending movies and TV shows.
 *     description: Retrieves the top 7 movies and TV shows that are currently trending, based on the number of views within the last 24 hours.
 *     responses:
 *       200:
 *         description: A list of trending movies and TV shows.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *                 $ref: '#/components/schemas/TVShow'
 *       500:
 *         description: Internal server error.
 */

app.get('/api/trending', async (req, res) => {
  const Url = `https://api.themoviedb.org/3/movie/trending/all/day?api_key=${API_KEY}&language=en-US&page=1`;
  try {
    const response = await fetch(Url);
    const data = await response.json();
    const movies = data.results.slice(0, 7);
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