//TODO Import library
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const expressHandlebarsSections = require("express-handlebars-sections");
const session = require("express-session");
const cors = require("cors");

// Setup variable
const env = require("./configs/envConfigs");
const app = express();
const connectDataBase = require("./configs/database");
const route = require("./routes/index");
const passport = require("./configs/passport");
const hbs = exphbs.create({
  // config hbs
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",

  helpers: {
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    jsonString: function (data) {
      return JSON.stringify(data);
    },
    eq: function (v1, v2) {
      return v1 === v2 ? true : false;
    }
  },
});
var PORT = env.port;

// Deploying functions
// register `hbs.engine` with the Express app.
// setup view engine
app.use(express.static(path.join(__dirname, "/public")));

// CORS
app.use(cors());

expressHandlebarsSections(hbs);
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname + "/views"));

// Use JSON parser for all non-webhook routes
// app.use((req, res, next) => {
//   if (req.originalUrl.startsWith("/payment/stripe/webhook")) {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
// Setup express response and body parser configurations
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup cookie and use passport
app.use(require("cookie-parser")());
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
    resave: true,
    saveUninitialized: true,
    secret: "cats",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// connect to database
connectDataBase();

// child handling parts
route(app);

// error handling
app.use((req, res) => {
  res.render("errors/404", { layout: false });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).render("errors/500", { layout: false, error: err.message });
});

// server listen
if (PORT == null || PORT == "") {
  PORT = 5000;
}

app.listen(PORT, function () {
  console.log("Server has started successfully", PORT);
});
