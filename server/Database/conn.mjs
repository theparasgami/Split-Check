import mongoose from "mongoose";

const DB = process.env.DATABASE;
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => console.log("Connection not done: " + err));
