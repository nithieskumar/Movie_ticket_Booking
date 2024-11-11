const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 5000;

const app = express();

dotenv.config();

// Allow multiple origins (for development and production environments)
const allowedOrigins = [
  'http://localhost:3000', // React dev server
  'https://cinebook.netlify.app', // Your deployed frontend
];

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 request per windowMs
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        // Allow requests from both localhost and the deployed site
        callback(null, true);
      } else {
        // Reject requests from other origins
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies if required
  })
);

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

app.use("/auth", AuthRoutes);
app.use("/api", movieRoutes);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
