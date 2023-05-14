const mongoose = require("mongoose");
const env = require("./envConfigs");

//set up mongoose
mongoose.set("strictQuery", false);

function connectMongoose() {
  mongoose
    .connect(env.urlMongo + env.dataBaseOwner, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB database");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB database", error);
    });
}

module.exports = connectMongoose;
