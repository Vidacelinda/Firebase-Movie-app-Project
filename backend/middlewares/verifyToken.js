const admin = require("firebase-admin");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const idToken = header.split(' ')[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error("Error verifying token:", error);
      res.status(403).json({ message: "Invalid token" });
    });
};