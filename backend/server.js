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
 * /movie:
 *   get:
 *     summary: Get the list of top-rated movies from The Movie Database API
 *     description: Retrieve a list of movies that are currently rated as the highest by The Movie Database API. The list is sorted by rating in descending order.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of top-rated movies
 *         schema:
 *           type: object
 *           properties:
 *             results:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Movie'
 *           required:
 *             - results
 *       500:
 *         description: An error occurred while processing the request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *           required:
 *             - message
 * definitions:
 *   Movie:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         example: 550
 *       title:
 *         type: string
 *         example: Fight Club
 *       overview:
 *         type: string
 *         example: A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. 
 *       poster_path:
 *         type: string
 *         example: /pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg
 *       vote_average:
 *         type: number
 *         example: 8.4
 *       release_date:
 *         type: string
 *         example: 1999-10-12
 *     required:
 *       - id
 *       - title
 *       - overview
 *       - poster_path
 *       - vote_average
 *       - release_date
 */

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
 * @swagger
 * /movietrending:
 *   get:
 *     summary: Get the list of trending movies and TV shows from The Movie Database API
 *     description: Retrieve a list of movies and TV shows that are currently trending on The Movie Database API, sorted by popularity in the last 24 hours.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of trending movies and TV shows
 *         schema:
 *           type: object
 *           properties:
 *             results:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/MovieTrending'
 *           required:
 *             - results
 *       500:
 *         description: An error occurred while processing the request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *           required:
 *             - message
 * definitions:
 *   MovieTrending:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         example: 497698
 *       title:
 *         type: string
 *         example: Black Widow
 *       overview:
 *         type: string
 *         example: Natasha Romanoff, also known as Black Widow, confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises.
 *       poster_path:
 *         type: string
 *         example: /qAZ0pzat24kLdO3o8ejmbLxyOac.jpg
 *       vote_average:
 *         type: number
 *         example: 7.8
 *       release_date:
 *         type: string
 *         example: 2021-07-07
 *     required:
 *       - id
 *       - title
 *       - overview
 *       - poster_path
 *       - vote_average
 *       - release_date
 */

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

// app.get('/api/trending', async (req, res) => {
//   const Url = `https://api.themoviedb.org/3/movie/trending/all/day?api_key=${API_KEY}&language=en-US&page=1`;
//   try {
//     const response = await fetch(Url);
//     const data = await response.json();
//     const movies = data.results.slice(0, 7);
//     res.send(movies);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
