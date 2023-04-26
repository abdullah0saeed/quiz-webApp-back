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
  q: { type: Array },
  a: { type: Array },
  b: { type: Array },
  c: { type: Array },
  d: { type: Array },
  corrA: { type: Array },
  corrB: { type: Array },
  corrC: { type: Array },
  corrD: { type: Array },
  password: { type: String },
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

//get all quizes
app.get("/quizes", function (req, res, next) {
  Quiz.find(
    {},
    ok(next, function (user) {
      res.send(user);
    })
  );
});

//get a quiz
app.get("/quizes/:id", function (req, res, next) {
  let foundQuiz = null;
  Quiz.find(
    {},
    ok(next, function (quizzes) {
      quizzes.forEach((quiz) => {
        if (quiz._id == req.params.id) {
          foundQuiz = quiz;
        }
      });
      if (foundQuiz !== null) {
        res.send(foundQuiz);
      } else {
        res.send({ message: "no quiz with such id" });
      }
    })
  );
});

//add new quiz
app.post("/quizes", function (req, res, next) {
  const newQuiz = new Quiz(req.body);
  newQuiz.save(
    ok(next, function (result) {
      res.send({ id: newQuiz._id });
    })
  );
});

//edit a quiz using id and password
app.put("/editQuiz/:id", (req, res, next) => {
  Quiz.findById(
    { _id: req.params.id },
    ok(next, (quiz) => {
      quiz.set(req.body);
      quiz.save(
        ok(next, (result) => {
          res.send(result);
        })
      );
    })
  );
});

//get quiz using id and password
app.post("/oneQuiz", (req, res, next) => {
  let foundQuiz = null;
  Quiz.find(
    {},
    ok(next, (quizes) => {
      quizes.forEach((quiz) => {
        if (quiz._id == req.body.id) {
          foundQuiz = quiz;
        }
      });
      if (foundQuiz === null) {
        res.send({ message: "no quiz with such id" });
      } else if (
        foundQuiz !== null &&
        foundQuiz.password === req.body.password
      ) {
        res.send(foundQuiz);
      } else if (
        foundQuiz !== null &&
        foundQuiz.password !== req.body.password
      ) {
        res.send({ message: "wrong password" });
      }
    })
  );
});
