
var admin = require("firebase-admin");
const verifyToken = require('./middlewares/verifyToken');

var cred = require("./credentials.json");

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
