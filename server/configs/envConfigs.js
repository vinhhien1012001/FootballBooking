require("dotenv").config({});

module.exports = {
  urlMongo: process.env.URL_MONGO,
  urlMongoLocal: process.env.URL_MONGO_LOCAL,
  dataBaseOwner: process.env.DATABASE_OWNER,
  dataBaseImg: process.env.DATABASE_IMG,
  imgBucket: process.env.IMG_BUCKET,
  port: process.env.PORT,
  salt: process.env.SALT,
  urlImg: process.env.URL_IMG,
  REDIS_HOSTNAME: process.env.REDIS_HOSTNAME,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  stripePrivateKey: process.env.STRIPE_PRIVATE_KEY,

  mailUserName: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
  mailFormAddress: process.env.MAIL_FROM_ADDRESS,
};
