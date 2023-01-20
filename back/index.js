const express = require("express");
// const serverless = require("serverless-http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const errorHandler = require("errorhandler");
const ok = require("okay");
const { type } = require("express/lib/response");
const { json } = require("body-parser");

//linking the database
// const dbURL = "mongodb://localhost:27017/creditSystem";
const dbURL =
  "mongodb+srv://abdullahSaeed:As25103122000@cluster0.a4rw7zv.mongodb.net/quizSystem";
const db = mongoose.createConnection(dbURL);

//manipulate database
const Schema = mongoose.Schema;

//user schema
const quizSchema = new Schema({
  quiz: { type: Object },
});
const Quiz = db.model("Quiz", quizSchema, "quizes");

///////////////server\\\\\\\\\\\\\\\\\\\\\
const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(errorHandler());

const port = process.env.PORT || 7000;
app.listen(port, function () {
  console.log("Server is running at Port: " + port);
});

app.get("/", function (req, res) {
  res.send("Server is running!");
});

//get a quiz
app.get("/quizes/:id", function (req, res, next) {
  User.findById(
    { id: req.params.id },
    ok(next, function (user) {
      res.send(user);
    })
  );
});

//add new quiz
app.post("/quizes", function (req, res, next) {
  const newQuiz = new Quiz(req.body);
  newQuiz.save(
    ok(next, function (result) {
      res.send(result);
    })
  );
});
