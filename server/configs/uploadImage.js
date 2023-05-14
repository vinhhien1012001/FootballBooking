const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const env = require("./envConfigs");

var storage = new GridFsStorage({
  url: env.urlMongo + env.dataBaseOwner,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: env.imgBucket,
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).array("images", 3);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
