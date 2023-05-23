const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const app = express();

//env
dotenv.config({ path: "./config.env" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const frontend=process.env.FRONTEND_URL
// Cors
app.use(
  cors({
    origin:frontend , // Replace with your React app's domain
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

const SESSION_SECRET = (process.env.SESSION_SECRET);
//Authentication
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
      sameSite: "Lax", // or 'None' if using HTTPS
      secure: false,
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use(function (req, res, next) {
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type, Accept,Authorization,Origin"
//   );
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

//DATABASE
require("./Database/conn");

//routes
app.use(require("./routes/auth"));
app.use(require("./routes/user"));
app.use(require("./routes/groups"));
app.use(require("./routes/expenses"));

//connection
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
