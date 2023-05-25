import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import "./config/detenv.mjs";
import "./Database/conn.mjs";


import authRoutes from "./routes/auth.mjs";
import userRoutes from "./routes/user.mjs";
import groupsRoutes from "./routes/groups.mjs";
import expensesRoutes from "./routes/expenses.mjs";

const app = express();


app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

const frontend = process.env.FRONTEND_URL;
// Cors
app.use(
  cors({
    origin: frontend, // Replace with your React app's domain
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

const SESSION_SECRET = process.env.SESSION_SECRET;
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
      sameSite: "Lax", // or 'None' if using HTTPS
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


//routes
app.use(authRoutes);
app.use(userRoutes);
app.use(groupsRoutes);
app.use(expensesRoutes);

//connection
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

export default app;
