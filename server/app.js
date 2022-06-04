const express = require("express");
const bodyParser= require("body-parser");
const dotenv=require("dotenv");
const session = require("express-session");
const passport = require("passport");
const app = express();

//env
dotenv.config({path:'./config.env'});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


    app.use(session({
        secret:"A Dark Secret",
        resave:false,
        saveUninitialized:false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    //DATABASE
    require("./Database/conn");

//routes
app.use(require("./routes/auth"));
app.use(require("./routes/user"));
app.use(require("./routes/groups"));

//connection
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));


module.exports = app;