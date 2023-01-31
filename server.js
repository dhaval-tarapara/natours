const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect("mongodb://127.0.0.1:27017/natours")
  .then(() => {
    console.log("Database connection successfull!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
const host = "localhost";

app.listen(port, () => {
  console.log(`App is running on ${host}:${port}`);
});