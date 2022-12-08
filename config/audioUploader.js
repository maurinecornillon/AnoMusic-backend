const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");

async function audioUploader(req, res, next) {
  const reqBody = req.body;
  const { path: audioPath } = req.files.audio[0]; // file becomes available in req at this point
  const { path: coverPath } = req.files.cover[0]; // file becomes available in req at this point

  // Get the file name and extension with multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

  // Filter the file to validate if it meets the required audio extension
  const fileFilter = (req, file, cb) => {
    if (acceptedFiles.includes(file.mimetype)) {
      cb(null, true);
    }
  };

  // Set the storage, file filter and file size with multer
  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
  }).fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]);

  // upload to cloudinary
  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    cloudinary.uploader
      .upload(audioPath, {
        resource_type: "raw",
        // public_id: `anomusic/${audioName}`,
      })
      .then((audio) => {
        fs.unlinkSync(audioPath);
        req.files.audio = audio;

        return cloudinary.uploader.upload(coverPath);
      })
      .then((cover) => {
        fs.unlinkSync(coverPath);
        req.files.cover = cover;
        req.body = reqBody;
        next();
      })
      .catch((err) => {
        next(err);
      });
  });
}

module.exports = audioUploader;
