const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("node:fs");

const acceptedFiles = ["audio/mp3", "image/png", "image/jpeg", "image/jpg"];

async function audioUploader(req, res, next) {
  const { path: audioPath } = req.files.audio[0]; // file becomes available in req at this point
  const { path: coverPath } = req.files.cover[0]; // file becomes available in req at this point

  const audioName = req.files.audio[0].originalname.split(".")[0];
  const coverName = req.files.cover[0].originalname.split(".")[0];

  // Get the file name and extension with multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
    destination: "/tmp/anomusic",
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

    console.log(audioPath, audioName);
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
        console.log(req.files);
        next();
      })
      .catch((err) => {
        next(err);
      });
  });
}

module.exports = audioUploader;
