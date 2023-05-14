const upload = require("../configs/uploadImage");
const env = require("../configs/envConfigs");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = env.urlMongo;

const mongoClient = new MongoClient(url);

async function uploadFile(req, res) {
  try {
    await upload(req, res);

    if (req.files.length <= 0) {
      console.log("You must select at least 1 file.");
      return "";
    }
    console.log("upload image successfully");
    return req.files;
  } catch (error) {
    console.log(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return "";
  }
}

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(env.dataBaseOwner);
    const bucket = new GridFSBucket(database, {
      bucketName: env.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deleteFile = async (req, res, fileName) => {
  const database = mongoClient.db(env.dataBaseOwner);
  const bucket = new GridFSBucket(database, {
    bucketName: env.imgBucket,
  });
  bucket.find({ filename: fileName }).toArray((err, files) => {
    if (err) throw err;

    if (files.length === 0) {
      console.log("File not found");
      return false;
    }

    // Get the ID of the file
    const fileId = files[0]._id;

    // Delete the file
    bucket.delete(fileId, (err) => {
      if (err) throw err;

      console.log("File deleted successfully");
      return true;
    });
  });
};

module.exports = {
  uploadFile,
  download,
  deleteFile,
};
