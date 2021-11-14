const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const { Transformation } = require("../helpers/constants");

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

class UploadFileAvatar {
  constructor(destination) {
    this.destination = destination;
    this.uploadCloud = promisify(cloudinary.uploader.upload);
  }

  async save(filePath, idUserCloud) {
    const { public_id: returnIdUserCloud, secure_url: avatarUrl } =
      await this.uploadCloud(filePath, {
        public_id: idUserCloud,
        folder: this.destination,
        transformation: {
          width: Transformation.WIDTH,
          height: Transformation.HEIGHT,
          crop: "pad",
        },
      });
    return {
      avatarUrl: avatarUrl,
      returnIdUserCloud: returnIdUserCloud.replace(`${this.destination}/`, ""),
    };
  }
}

module.exports = UploadFileAvatar;
